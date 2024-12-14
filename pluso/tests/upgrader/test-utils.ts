// core/module/upgrader.ts
import { VersionManager, Version } from './version';
import { ModuleRegistry } from './registry';
import { ConflictResolver } from './conflict-resolver';

export interface UpgradeResult {
  moduleId: string;
  fromVersion: string;
  toVersion: string;
  status: 'success' | 'failed' | 'skipped';
  reason?: string;
  breaking: boolean;
}

export interface UpgradeOptions {
  includePrereleases?: boolean;
  ignoreBreaking?: boolean;
  depth?: number;
  strategy: 'all' | 'compatible' | 'patch' | 'minor';
}

export class DependencyUpgrader {
  private upgradeQueue: Set<string> = new Set();
  private completed: Map<string, UpgradeResult> = new Map();

  constructor(
    private registry: ModuleRegistry,
    private conflictResolver: ConflictResolver,
    private fetchLatestVersions: (packageName: string) => Promise<string[]>
  ) {}

  async upgradeAll(options: UpgradeOptions = { strategy: 'compatible' }): Promise<UpgradeResult[]> {
    const modules = Array.from(this.registry.getDependencyGraph().keys());
    return this.upgradeBatch(modules, options);
  }

  async upgradeBatch(moduleIds: string[], options: UpgradeOptions): Promise<UpgradeResult[]> {
    const results: UpgradeResult[] = [];
    const visited = new Set<string>();

    for (const moduleId of moduleIds) {
      if (!visited.has(moduleId)) {
        const result = await this.upgradeModule(moduleId, options);
        results.push(result);
        visited.add(moduleId);

        // Handle dependencies if within depth limit
        if (options.depth !== 0) {
          const deps = await this.getDependencies(moduleId);
          const newOptions = { 
            ...options, 
            depth: options.depth ? options.depth - 1 : undefined 
          };
          const depResults = await this.upgradeBatch(Array.from(deps), newOptions);
          results.push(...depResults);
        }
      }
    }

    return results;
  }

  private async upgradeModule(moduleId: string, options: UpgradeOptions): Promise<UpgradeResult> {
    try {
      const [name, currentVersion] = moduleId.split('@');
      const availableVersions = await this.fetchLatestVersions(name);
      
      const current = VersionManager.parse(currentVersion);
      const compatible = this.findCompatibleUpgrade(current, availableVersions, options);

      if (!compatible) {
        return {
          moduleId,
          fromVersion: currentVersion,
          toVersion: currentVersion,
          status: 'skipped',
          reason: 'No compatible upgrade found',
          breaking: false
        };
      }

      const breaking = this.isBreakingChange(current, compatible);
      if (breaking && !options.ignoreBreaking) {
        return {
          moduleId,
          fromVersion: currentVersion,
          toVersion: `${compatible.major}.${compatible.minor}.${compatible.patch}`,
          status: 'skipped',
          reason: 'Breaking change not allowed',
          breaking: true
        };
      }

      // Perform the upgrade
      await this.performUpgrade(moduleId, compatible);

      return {
        moduleId,
        fromVersion: currentVersion,
        toVersion: `${compatible.major}.${compatible.minor}.${compatible.patch}`,
        status: 'success',
        breaking
      };

    } catch (error) {
      return {
        moduleId,
        fromVersion: moduleId.split('@')[1],
        toVersion: moduleId.split('@')[1],
        status: 'failed',
        reason: (error as Error).message,
        breaking: false
      };
    }
  }

  private findCompatibleUpgrade(
    current: Version,
    available: string[],
    options: UpgradeOptions
  ): Version | null {
    const versions = available
      .filter(v => options.includePrereleases || !v.includes('-'))
      .map(v => VersionManager.parse(v))
      .filter(v => this.isValidUpgrade(current, v, options))
      .sort((a, b) => VersionManager.compare(b, a));

    return versions[0] || null;
  }

  private isValidUpgrade(current: Version, target: Version, options: UpgradeOptions): boolean {
    switch (options.strategy) {
      case 'all':
        return VersionManager.compare(target, current) > 0;
      
      case 'compatible':
        return target.major === current.major &&
               VersionManager.compare(target, current) > 0;
      
      case 'minor':
        return target.major === current.major &&
               target.minor > current.minor;
      
      case 'patch':
        return target.major === current.major &&
               target.minor === current.minor &&
               target.patch > current.patch;
      
      default:
        return false;
    }
  }

  private isBreakingChange(current: Version, target: Version): boolean {
    return target.major > current.major;
  }

  private async performUpgrade(moduleId: string, newVersion: Version): Promise<void> {
    const [name] = moduleId.split('@');
    const newModuleId = `${name}@${newVersion.major}.${newVersion.minor}.${newVersion.patch}`;

    // Update registry
    const moduleRef = await this.registry.resolveModule(moduleId);
    moduleRef.config.version = `${newVersion.major}.${newVersion.minor}.${newVersion.patch}`;

    // Resolve any new conflicts
    await this.conflictResolver.resolveConflicts(newModuleId);
  }

  private async getDependencies(moduleId: string): Promise<Set<string>> {
    const moduleRef = await this.registry.resolveModule(moduleId);
    return moduleRef.dependencies;
  }

  async getUpgradePreview(moduleId: string, options: UpgradeOptions = { strategy: 'compatible' }): Promise<{
    current: string;
    available: string[];
    recommended: string | null;
    breaking: boolean;
  }> {
    const [name, currentVersion] = moduleId.split('@');
    const availableVersions = await this.fetchLatestVersions(name);
    const current = VersionManager.parse(currentVersion);
    const compatible = this.findCompatibleUpgrade(current, availableVersions, options);

    return {
      current: currentVersion,
      available: availableVersions,
      recommended: compatible ? 
        `${compatible.major}.${compatible.minor}.${compatible.patch}` : 
        null,
      breaking: compatible ? this.isBreakingChange(current, compatible) : false
    };
  }

  getUpgradeResults(): Map<string, UpgradeResult> {
    return new Map(this.completed);
  }