import { walk } from "https://deno.land/std@0.208.0/fs/walk.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { db } from "../utils/db.ts";
import { metaPromptingService } from "./meta-prompting.ts";

interface RouteNode {
  path: string;
  type: 'api' | 'island' | 'page';
  handler: string;
  dependencies: string[];
  connectedIslands: string[];
  apiEndpoints: string[];
  errorPatterns: Map<string, ErrorPattern>;
}

interface ErrorPattern {
  count: number;
  lastOccurred: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedComponents: Set<string>;
  stackTraces: string[];
  context: Record<string, unknown>;
}

interface RouteMap {
  nodes: Map<string, RouteNode>;
  edges: Map<string, Set<string>>;
}

export class RouteAnalyzer {
  private static instance: RouteAnalyzer;
  private routeMap: RouteMap;
  private islandDependencies: Map<string, Set<string>>;
  private apiDependencies: Map<string, Set<string>>;
  private errorGroups: Map<string, Set<string>>;

  private constructor() {
    this.routeMap = {
      nodes: new Map(),
      edges: new Map()
    };
    this.islandDependencies = new Map();
    this.apiDependencies = new Map();
    this.errorGroups = new Map();
    this.initialize();
  }

  public static getInstance(): RouteAnalyzer {
    if (!RouteAnalyzer.instance) {
      RouteAnalyzer.instance = new RouteAnalyzer();
    }
    return RouteAnalyzer.instance;
  }

  private async initialize() {
    await this.scanRoutes();
    await this.analyzeConnections();
    await this.loadErrorHistory();
  }

  private async scanRoutes() {
    // Scan API routes
    for await (const entry of walk("routes/api")) {
      if (entry.isFile && entry.name.endsWith(".ts")) {
        await this.analyzeApiRoute(entry.path);
      }
    }

    // Scan Islands
    for await (const entry of walk("islands")) {
      if (entry.isFile && entry.name.endsWith(".tsx")) {
        await this.analyzeIsland(entry.path);
      }
    }

    // Scan Pages
    for await (const entry of walk("routes")) {
      if (entry.isFile && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
        await this.analyzePage(entry.path);
      }
    }
  }

  private async analyzeApiRoute(path: string) {
    const content = await Deno.readTextFile(path);
    const routePath = this.getRoutePath(path);
    
    // Extract handler information and dependencies
    const handler = await this.extractHandler(content);
    const dependencies = await this.extractDependencies(content);
    
    // Create route node
    this.routeMap.nodes.set(routePath, {
      path: routePath,
      type: 'api',
      handler,
      dependencies,
      connectedIslands: [],
      apiEndpoints: [],
      errorPatterns: new Map()
    });

    // Analyze API dependencies
    for (const dep of dependencies) {
      if (!this.apiDependencies.has(dep)) {
        this.apiDependencies.set(dep, new Set());
      }
      this.apiDependencies.get(dep)?.add(routePath);
    }
  }

  private async analyzeIsland(path: string) {
    const content = await Deno.readTextFile(path);
    const islandName = this.getIslandName(path);
    
    // Extract API calls and dependencies
    const apiCalls = await this.extractApiCalls(content);
    const dependencies = await this.extractDependencies(content);
    
    // Create island node
    this.routeMap.nodes.set(islandName, {
      path: islandName,
      type: 'island',
      handler: '',
      dependencies,
      connectedIslands: [],
      apiEndpoints: apiCalls,
      errorPatterns: new Map()
    });

    // Link islands to API routes
    for (const api of apiCalls) {
      const apiNode = this.routeMap.nodes.get(api);
      if (apiNode) {
        apiNode.connectedIslands.push(islandName);
      }
    }

    // Track island dependencies
    for (const dep of dependencies) {
      if (!this.islandDependencies.has(dep)) {
        this.islandDependencies.set(dep, new Set());
      }
      this.islandDependencies.get(dep)?.add(islandName);
    }
  }

  private async analyzePage(path: string) {
    const content = await Deno.readTextFile(path);
    const pagePath = this.getPagePath(path);
    
    // Extract islands used in the page
    const islands = await this.extractIslands(content);
    const dependencies = await this.extractDependencies(content);
    
    // Create page node
    this.routeMap.nodes.set(pagePath, {
      path: pagePath,
      type: 'page',
      handler: '',
      dependencies,
      connectedIslands: islands,
      apiEndpoints: [],
      errorPatterns: new Map()
    });

    // Create edges for page-island connections
    if (!this.routeMap.edges.has(pagePath)) {
      this.routeMap.edges.set(pagePath, new Set());
    }
    for (const island of islands) {
      this.routeMap.edges.get(pagePath)?.add(island);
    }
  }

  public async groupError(error: Error, context: Record<string, unknown>) {
    const errorKey = await this.getErrorKey(error, context);
    const affectedRoutes = await this.findAffectedRoutes(error, context);
    
    // Group similar errors
    if (!this.errorGroups.has(errorKey)) {
      this.errorGroups.set(errorKey, new Set());
    }
    for (const route of affectedRoutes) {
      this.errorGroups.get(errorKey)?.add(route);
    }

    // Update error patterns for affected routes
    for (const route of affectedRoutes) {
      const node = this.routeMap.nodes.get(route);
      if (node) {
        if (!node.errorPatterns.has(errorKey)) {
          node.errorPatterns.set(errorKey, {
            count: 0,
            lastOccurred: new Date(),
            severity: this.getSeverity(error),
            affectedComponents: new Set(),
            stackTraces: [],
            context: {}
          });
        }
        const pattern = node.errorPatterns.get(errorKey)!;
        pattern.count++;
        pattern.lastOccurred = new Date();
        pattern.stackTraces.push(error.stack || '');
        pattern.context = { ...pattern.context, ...context };
        
        // Add affected components
        if (context.component) {
          pattern.affectedComponents.add(context.component as string);
        }
      }
    }

    // Analyze patterns using meta-prompting
    await this.analyzeErrorPatterns(errorKey);
  }

  private async analyzeErrorPatterns(errorKey: string) {
    const affectedRoutes = this.errorGroups.get(errorKey) || new Set();
    const patterns = new Map<string, ErrorPattern>();
    
    // Collect patterns from all affected routes
    for (const route of affectedRoutes) {
      const node = this.routeMap.nodes.get(route);
      if (node?.errorPatterns.has(errorKey)) {
        patterns.set(route, node.errorPatterns.get(errorKey)!);
      }
    }

    // Use meta-prompting to analyze patterns
    const analysis = await metaPromptingService.analyze({
      query: "Analyze error patterns across routes",
      context: {
        patterns: Array.from(patterns.entries()),
        routes: Array.from(affectedRoutes),
        dependencies: this.getDependencyChain(Array.from(affectedRoutes))
      },
      strategy: "chain-of-thought"
    });

    // Store analysis results
    await this.storeAnalysis(errorKey, analysis);
  }

  private async findAffectedRoutes(error: Error, context: Record<string, unknown>): Promise<string[]> {
    const affectedRoutes = new Set<string>();
    
    // Check direct route
    if (context.route) {
      affectedRoutes.add(context.route as string);
      
      // Add connected islands
      const node = this.routeMap.nodes.get(context.route as string);
      if (node) {
        node.connectedIslands.forEach(island => affectedRoutes.add(island));
      }
    }

    // Check component
    if (context.component) {
      // Find routes using this component
      for (const [route, node] of this.routeMap.nodes) {
        if (node.dependencies.includes(context.component as string)) {
          affectedRoutes.add(route);
        }
      }
    }

    // Check stack trace for additional routes
    if (error.stack) {
      const routes = this.extractRoutesFromStack(error.stack);
      routes.forEach(route => affectedRoutes.add(route));
    }

    return Array.from(affectedRoutes);
  }

  private getDependencyChain(routes: string[]): string[] {
    const dependencies = new Set<string>();
    
    for (const route of routes) {
      const node = this.routeMap.nodes.get(route);
      if (node) {
        // Add direct dependencies
        node.dependencies.forEach(dep => dependencies.add(dep));
        
        // Add API dependencies
        node.apiEndpoints.forEach(api => {
          const apiNode = this.routeMap.nodes.get(api);
          if (apiNode) {
            apiNode.dependencies.forEach(dep => dependencies.add(dep));
          }
        });
      }
    }

    return Array.from(dependencies);
  }

  private async storeAnalysis(errorKey: string, analysis: any) {
    try {
      await db.insertOne("route_error_analysis", {
        error_key: errorKey,
        affected_routes: Array.from(this.errorGroups.get(errorKey) || []),
        pattern_analysis: analysis.patterns,
        suggested_fixes: analysis.suggestedFixes,
        dependency_impact: analysis.dependencyImpact,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Failed to store route analysis:", error);
    }
  }

  private async extractHandler(content: string): Promise<string> {
    // TODO: Implement handler extraction
    return "";
  }

  private async extractDependencies(content: string): Promise<string[]> {
    // TODO: Implement dependency extraction
    return [];
  }

  private async extractApiCalls(content: string): Promise<string[]> {
    // TODO: Implement API call extraction
    return [];
  }

  private async extractIslands(content: string): Promise<string[]> {
    // TODO: Implement island extraction
    return [];
  }

  private async analyzeConnections(): Promise<void> {
    // TODO: Implement connection analysis
  }

  private async loadErrorHistory(): Promise<void> {
    // TODO: Implement error history loading
  }

  // Helper methods
  private getRoutePath(path: string): string {
    return path.replace(/^routes/, '').replace(/\.[jt]sx?$/, '');
  }

  private getIslandName(path: string): string {
    return path.replace(/^islands\//, '').replace(/\.[jt]sx?$/, '');
  }

  private getPagePath(path: string): string {
    return path.replace(/^routes/, '').replace(/\.[jt]sx?$/, '');
  }

  private async getErrorKey(error: Error, context: Record<string, unknown>): Promise<string> {
    return `${error.name}:${error.message}:${context.component || ''}:${context.route || ''}`;
  }

  private getSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (error instanceof TypeError) return 'high';
    if (error instanceof ReferenceError) return 'high';
    if (error instanceof SyntaxError) return 'critical';
    return 'medium';
  }

  private extractRoutesFromStack(stack: string): string[] {
    const routes: string[] = [];
    const lines = stack.split('\n');
    
    for (const line of lines) {
      if (line.includes('/routes/') || line.includes('/islands/')) {
        const match = line.match(/\/(routes|islands)\/[^:]+/);
        if (match) {
          routes.push(this.getRoutePath(match[0]));
        }
      }
    }

    return routes;
  }

  // Analysis methods
  public async getRouteErrorSummary(route: string): Promise<any> {
    const node = this.routeMap.nodes.get(route);
    if (!node) return null;

    return {
      route,
      type: node.type,
      errorPatterns: Array.from(node.errorPatterns.entries()),
      connectedIslands: node.connectedIslands,
      apiEndpoints: node.apiEndpoints,
      dependencies: node.dependencies
    };
  }

  public async getErrorImpactAnalysis(errorKey: string): Promise<any> {
    const affectedRoutes = this.errorGroups.get(errorKey);
    if (!affectedRoutes) return null;

    const analysis = await metaPromptingService.analyze({
      query: "Analyze error impact across routes",
      context: {
        routes: Array.from(affectedRoutes),
        patterns: Array.from(affectedRoutes).map(route => {
          const node = this.routeMap.nodes.get(route);
          return node?.errorPatterns.get(errorKey);
        }).filter(Boolean)
      },
      strategy: "zero-shot-decomposition"
    });

    return {
      errorKey,
      affectedRoutes: Array.from(affectedRoutes),
      analysis
    };
  }
}
