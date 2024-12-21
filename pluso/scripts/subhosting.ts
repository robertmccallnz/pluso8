import { load } from "https://deno.land/std/dotenv/mod.ts";

// 1.) Load environment variables
await load({
  export: true,
  allowEmptyValues: true,
});

const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = "6d196898-4676-4176-afd8-8a06066157d9"; // Fixed organization ID

if (!accessToken) {
  console.error("Error: DEPLOY_ACCESS_TOKEN environment variable is required");
  Deno.exit(1);
}

const API = "https://api.deno.com/v1";
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

async function createProject() {
  console.log("Creating new project...");
  const pr = await fetch(`${API}/organizations/${orgId}/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: null, // randomly generates project name
    }),
  });

  if (!pr.ok) {
    const error = await pr.text();
    throw new Error(`Failed to create project: ${pr.status} ${pr.statusText}\n${error}`);
  }

  const project = await pr.json();
  console.log("Project created:", project.name);
  return project;
}

async function deployProject(projectId: string) {
  console.log("Deploying project...");
  const dr = await fetch(`${API}/projects/${projectId}/deployments`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      entryPointUrl: "main.ts",
      assets: {
        "main.ts": {
          kind: "file",
          content: `export default { 
            async fetch(req) { 
              return new Response("Hello from Pluso Agent!", {
                headers: { "Content-Type": "text/plain" }
              }); 
            } 
          }`,
          encoding: "utf-8",
        },
      },
      envVars: {},
    }),
  });

  if (!dr.ok) {
    const error = await dr.text();
    throw new Error(`Failed to deploy: ${dr.status} ${dr.statusText}\n${error}`);
  }

  const deployment = await dr.json();
  console.log("Deployment status:", dr.status);
  return deployment;
}

try {
  const project = await createProject();
  const deployment = await deployProject(project.id);
  
  console.log("\nDeployment successful!");
  console.log("Project name:", project.name);
  console.log("Deployment ID:", deployment.id);
  console.log("Visit your site here:", `https://${project.name}-${deployment.id}.deno.dev`);
} catch (error) {
  console.error("Error:", error.message);
  Deno.exit(1);
}
