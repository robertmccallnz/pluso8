import { analyzeComponents, generateAnalysisReport, validateComponent } from "../helpers/component-analyzer.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";

async function main() {
  console.log("Starting component analysis...\n");

  // Analyze all components
  const islandsDir = join(Deno.cwd(), "pluso", "islands");
  const routesDir = join(Deno.cwd(), "pluso", "routes");

  console.log("Analyzing island components...");
  const islandResults = await analyzeComponents(islandsDir);
  
  console.log("Analyzing route components...");
  const routeResults = await analyzeComponents(routesDir);

  // Generate and print reports
  console.log("\nIsland Components Analysis:");
  console.log(generateAnalysisReport(islandResults));

  console.log("\nRoute Components Analysis:");
  console.log(generateAnalysisReport(routeResults));

  // Check specific components that were recently modified
  const criticalComponents = [
    join(islandsDir, "dashboard", "CreateAgent.tsx"),
    join(islandsDir, "CreateAgentFlow.tsx"),
    join(islandsDir, "AgentCreation", "AgentCreationWizard.tsx"),
    join(islandsDir, "agents", "maia", "MaiaWidget.tsx"),
    join(islandsDir, "agents", "jeff", "JeffWidget.tsx"),
    join(islandsDir, "agents", "petunia", "PetuniaWidget.tsx"),
  ];

  console.log("\nValidating critical components:");
  for (const component of criticalComponents) {
    try {
      const { isValid, issues } = await validateComponent(component);
      console.log(`\n${component}:`);
      if (isValid) {
        console.log("✅ No issues found");
      } else {
        console.log("❌ Issues found:");
        issues.forEach(issue => console.log(`  - ${issue}`));
      }
    } catch (error) {
      console.error(`Error validating ${component}:`, error.message);
    }
  }

  // Exit with error if any issues were found
  const hasIssues = [...islandResults, ...routeResults].some(result => result.issues.length > 0);
  if (hasIssues) {
    console.error("\n❌ Issues found in component analysis. Please fix the issues above.");
    Deno.exit(1);
  } else {
    console.log("\n✅ All components passed validation!");
    Deno.exit(0);
  }
}

if (import.meta.main) {
  main().catch(error => {
    console.error("Error running analysis:", error);
    Deno.exit(1);
  });
}
