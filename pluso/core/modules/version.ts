// core/module/version.ts
export interface Version {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
  }
  
  export class VersionManager {
    static parse(version: string): Version {
      const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
      if (!match) {
        throw new Error(`Invalid version string: ${version}`);
      }
  
      return {
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3]),
        prerelease: match[4]
      };
    }
  
    static compare(v1: Version, v2: Version): number {
      if (v1.major !== v2.major) return v1.major - v2.major;
      if (v1.minor !== v2.minor) return v1.minor - v2.minor;
      if (v1.patch !== v2.patch) return v1.patch - v2.patch;
      
      // Handle prerelease versions
      if (!v1.prerelease && !v2.prerelease) return 0;
      if (!v1.prerelease) return 1;
      if (!v2.prerelease) return -1;
      return v1.prerelease.localeCompare(v2.prerelease);
    }
  
    static satisfies(version: Version, range: string): boolean {
      // Implement semver range checking
      // Example: "^1.2.3", "~2.0.0", ">=1.0.0"
      const operators = {
        '^': (v: Version, target: Version) => 
          v.major === target.major && 
          (v.major > 0 ? v.minor >= target.minor : v.minor === target.minor),
        '~': (v: Version, target: Version) =>
          v.major === target.major && v.minor === target.minor && v.patch >= target.patch,
        '>=': (v: Version, target: Version) =>
          VersionManager.compare(v, target) >= 0,
        '>': (v: Version, target: Version) =>
          VersionManager.compare(v, target) > 0,
        '<=': (v: Version, target: Version) =>
          VersionManager.compare(v, target) <= 0,
        '<': (v: Version, target: Version) =>
          VersionManager.compare(v, target) < 0,
        '=': (v: Version, target: Version) =>
          VersionManager.compare(v, target) === 0
      };
  
      // Parse range and check against version
      const match = range.match(/^([~^>=<])?(.+)$/);
      if (!match) return false;
  
      const [, operator = '=', versionStr] = match;
      const targetVersion = VersionManager.parse(versionStr);
      return operators[operator as keyof typeof operators](version, targetVersion);
    }
  }
  
  // core/module/conflict-resolver.ts
  export interface ConflictResolution {
    moduleId: string;
    resolvedVersion: string;
    conflictingVersions: string[];
    resolution: 'highest' | 'lowest' | 'specific' | 'maintained';
    reason: string;
  }
  
  export class ConflictResolver {
    private resolutionStrategy: 'highest' | 'lowest' | 'specific' = 'highest';
    private resolutions: Map<string, ConflictResolution> = new Map();
  
    constructor(private registry: ModuleRegistry) {}
  
    async resolveConflicts(moduleId: string): Promise<ConflictResolution[]> {
      const conflicts = await this.detectConflicts(moduleId);
      return Promise.all(conflicts.map(conflict => this.resolveConflict(conflict)));
    }
  
    private async detectConflicts(moduleId: string): Promise<Array<{
      name: string;
      versions: string[];
      dependents: Map<string, string>;
    }>> {
      const deps = await this.registry.getDependencyGraph();
      const conflicts: Record<string, Set<string>> = {};
      const dependents: Record<string, Map<string, string>> = {};
  
      // Collect all versions of each module
      for (const [mod, dependencies] of deps) {
        for (const dep of dependencies) {
          const [name, version] = dep.split('@');
          if (!conflicts[name]) {
            conflicts[name] = new Set();
            dependents[name] = new Map();
          }
          conflicts[name].add(version);
          dependents[name].set(mod, version);
        }
      }
  
      // Filter to only conflicting modules
      return Object.entries(conflicts)
        .filter(([, versions]) => versions.size > 1)
        .map(([name, versions]) => ({
          name,
          versions: Array.from(versions),
          dependents: dependents[name]
        }));
    }
  
    private async resolveConflict(conflict: {
      name: string;
      versions: string[];
      dependents: Map<string, string>;
    }): Promise<ConflictResolution> {
      const versions = conflict.versions.map(v => VersionManager.parse(v));
      let resolvedVersion: Version;
      let resolution: ConflictResolution['resolution'];
      let reason: string;
  
      switch (this.resolutionStrategy) {
        case 'highest':
          resolvedVersion = versions.reduce((a, b) => 
            VersionManager.compare(a, b) > 0 ? a : b
          );
          resolution = 'highest';
          reason = 'Selected highest compatible version';
          break;
  
        case 'lowest':
          resolvedVersion = versions.reduce((a, b) => 
            VersionManager.compare(a, b) < 0 ? a : b
          );
          resolution = 'lowest';
          reason = 'Selected lowest compatible version';
          break;
  
        case 'specific':
          // Use specific version resolution rules
          const mainVersion = versions[0];
          const isCompatible = versions.every(v => 
            v.major === mainVersion.major
          );
  
          if (isCompatible) {
            resolvedVersion = versions.reduce((a, b) => 
              VersionManager.compare(a, b) > 0 ? a : b
            );
            resolution = 'specific';
            reason = 'All versions are compatible within major version';
          } else {
            // Maintain multiple versions if incompatible
            resolvedVersion = versions[0];
            resolution = 'maintained';
            reason = 'Incompatible major versions maintained separately';
          }
          break;
  
        default:
          throw new Error(`Unknown resolution strategy: ${this.resolutionStrategy}`);
      }
  
      const result: ConflictResolution = {
        moduleId: `${conflict.name}@${resolvedVersion.major}.${resolvedVersion.minor}.${resolvedVersion.patch}`,
        resolvedVersion: `${resolvedVersion.major}.${resolvedVersion.minor}.${resolvedVersion.patch}`,
        conflictingVersions: conflict.versions,
        resolution,
        reason
      };
  
      this.resolutions.set(conflict.name, result);
      return result;
    }
  
    setResolutionStrategy(strategy: 'highest' | 'lowest' | 'specific') {
      this.resolutionStrategy = strategy;
    }
  
    getResolution(moduleName: string): ConflictResolution | undefined {
      return this.resolutions.get(moduleName);
    }
  }