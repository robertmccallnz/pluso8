// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_layout from "./routes/_layout.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $about from "./routes/about.tsx";
import * as $agents_index from "./routes/agents/index.tsx";
import * as $api_agent_chat from "./routes/api/agent-chat.ts";
import * as $api_agents_chat from "./routes/api/agents/chat.ts";
import * as $api_agents_deploy from "./routes/api/agents/deploy.ts";
import * as $api_agents_index from "./routes/api/agents/index.ts";
import * as $api_agents_management from "./routes/api/agents/management.ts";
import * as $api_agents_ws_chat from "./routes/api/agents/ws-chat.ts";
import * as $api_create_checkout_session from "./routes/api/create-checkout-session.ts";
import * as $api_jeff_ws_chat from "./routes/api/jeff/ws-chat.ts";
import * as $api_maia_chat from "./routes/api/maia/chat.ts";
import * as $api_maia_config from "./routes/api/maia/config.ts";
import * as $api_maia_ws_chat from "./routes/api/maia/ws-chat.ts";
import * as $api_metrics_agentId_ from "./routes/api/metrics/[agentId].ts";
import * as $api_metrics_agent_id_ from "./routes/api/metrics/agent/[id].ts";
import * as $api_metrics_index from "./routes/api/metrics/index.ts";
import * as $api_metrics_record from "./routes/api/metrics/record.ts";
import * as $api_metrics_verify from "./routes/api/metrics/verify.ts";
import * as $api_metrics_ws from "./routes/api/metrics/ws.ts";
import * as $api_petunia_chat from "./routes/api/petunia/chat.ts";
import * as $api_petunia_ws_chat from "./routes/api/petunia/ws-chat.ts";
import * as $api_playground_chat from "./routes/api/playground/chat.ts";
import * as $api_stripe_create_checkout from "./routes/api/stripe/create-checkout.ts";
import * as $api_stripe_create_portal from "./routes/api/stripe/create-portal.ts";
import * as $api_stripe_webhook from "./routes/api/stripe/webhook.ts";
import * as $api_test_supabase from "./routes/api/test/supabase.ts";
import * as $api_upload_pdf from "./routes/api/upload-pdf.ts";
import * as $dashboard_create_agent from "./routes/dashboard/create-agent.tsx";
import * as $dashboard_create from "./routes/dashboard/create.tsx";
import * as $dashboard_index from "./routes/dashboard/index.tsx";
import * as $dashboard_metrics from "./routes/dashboard/metrics.tsx";
import * as $dashboard_playground from "./routes/dashboard/playground.tsx";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $jeff_config from "./routes/jeff/config.ts";
import * as $jeff_configloader from "./routes/jeff/configloader.ts";
import * as $jeff_index from "./routes/jeff/index.tsx";
import * as $jeff_services_scraper_legislationScraper from "./routes/jeff/services/scraper/legislationScraper.ts";
import * as $login from "./routes/login.tsx";
import * as $maia_config from "./routes/maia/config.ts";
import * as $maia_index from "./routes/maia/index.tsx";
import * as $metrics_index from "./routes/metrics/index.tsx";
import * as $models_index from "./routes/models/index.tsx";
import * as $petunia_index from "./routes/petunia/index.tsx";
import * as $AgentEvaluationTable from "./islands/AgentEvaluationTable.tsx";
import * as $AgentMetricsCard from "./islands/AgentMetricsCard.tsx";
import * as $AgentPerformanceChart from "./islands/AgentPerformanceChart.tsx";
import * as $AnimatedBackground from "./islands/AnimatedBackground.tsx";
import * as $CreateAgentFlow from "./islands/CreateAgentFlow.tsx";
import * as $CreateAgentFormIsland from "./islands/CreateAgentFormIsland.tsx";
import * as $CreateAgentSteps_ConfigurationStep from "./islands/CreateAgentSteps/ConfigurationStep.tsx";
import * as $CreateAgentSteps_DeploymentStep from "./islands/CreateAgentSteps/DeploymentStep.tsx";
import * as $CreateAgentSteps_EvaluationStep from "./islands/CreateAgentSteps/EvaluationStep.tsx";
import * as $CreateAgentSteps_IndustryStep from "./islands/CreateAgentSteps/IndustryStep.tsx";
import * as $CreateAgentSteps_ModelConfigStep from "./islands/CreateAgentSteps/ModelConfigStep.tsx";
import * as $CreateAgentSteps_PromptStep from "./islands/CreateAgentSteps/PromptStep.tsx";
import * as $CreateAgentSteps_SystemPromptStep from "./islands/CreateAgentSteps/SystemPromptStep.tsx";
import * as $CreateAgentSteps_TemplateStep from "./islands/CreateAgentSteps/TemplateStep.tsx";
import * as $CreateAgentSteps_ToolsStep from "./islands/CreateAgentSteps/ToolsStep.tsx";
import * as $DashboardTabsIsland from "./islands/DashboardTabsIsland.tsx";
import * as $FeatureHighlight from "./islands/FeatureHighlight.tsx";
import * as $MetricsPageIsland from "./islands/MetricsPageIsland.tsx";
import * as $ModelsPageIsland from "./islands/ModelsPageIsland.tsx";
import * as $NavBar from "./islands/NavBar.tsx";
import * as $Playground from "./islands/Playground.tsx";
import * as $agents_Chat from "./islands/agents/Chat.tsx";
import * as $auth_LoginForm from "./islands/auth/LoginForm.tsx";
import * as $components_AgentMetricsPanel from "./islands/components/AgentMetricsPanel.tsx";
import * as $components_ChatMessage from "./islands/components/ChatMessage.tsx";
import * as $dashboard_AnalyticsDashboard from "./islands/dashboard/AnalyticsDashboard.tsx";
import * as $dashboard_MetricsPanel from "./islands/dashboard/MetricsPanel.tsx";
import * as $interfaces_AgentConfig from "./islands/interfaces/AgentConfig.tsx";
import * as $interfaces_AuthComponent from "./islands/interfaces/AuthComponent.tsx";
import * as $interfaces_LegalChat from "./islands/interfaces/LegalChat.tsx";
import * as $interfaces_MaiaChat from "./islands/interfaces/MaiaChat.tsx";
import * as $interfaces_PetuniaChat from "./islands/interfaces/PetuniaChat.tsx";
import * as $interfaces_Widget from "./islands/interfaces/Widget.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_layout.tsx": $_layout,
    "./routes/_middleware.ts": $_middleware,
    "./routes/about.tsx": $about,
    "./routes/agents/index.tsx": $agents_index,
    "./routes/api/agent-chat.ts": $api_agent_chat,
    "./routes/api/agents/chat.ts": $api_agents_chat,
    "./routes/api/agents/deploy.ts": $api_agents_deploy,
    "./routes/api/agents/index.ts": $api_agents_index,
    "./routes/api/agents/management.ts": $api_agents_management,
    "./routes/api/agents/ws-chat.ts": $api_agents_ws_chat,
    "./routes/api/create-checkout-session.ts": $api_create_checkout_session,
    "./routes/api/jeff/ws-chat.ts": $api_jeff_ws_chat,
    "./routes/api/maia/chat.ts": $api_maia_chat,
    "./routes/api/maia/config.ts": $api_maia_config,
    "./routes/api/maia/ws-chat.ts": $api_maia_ws_chat,
    "./routes/api/metrics/[agentId].ts": $api_metrics_agentId_,
    "./routes/api/metrics/agent/[id].ts": $api_metrics_agent_id_,
    "./routes/api/metrics/index.ts": $api_metrics_index,
    "./routes/api/metrics/record.ts": $api_metrics_record,
    "./routes/api/metrics/verify.ts": $api_metrics_verify,
    "./routes/api/metrics/ws.ts": $api_metrics_ws,
    "./routes/api/petunia/chat.ts": $api_petunia_chat,
    "./routes/api/petunia/ws-chat.ts": $api_petunia_ws_chat,
    "./routes/api/playground/chat.ts": $api_playground_chat,
    "./routes/api/stripe/create-checkout.ts": $api_stripe_create_checkout,
    "./routes/api/stripe/create-portal.ts": $api_stripe_create_portal,
    "./routes/api/stripe/webhook.ts": $api_stripe_webhook,
    "./routes/api/test/supabase.ts": $api_test_supabase,
    "./routes/api/upload-pdf.ts": $api_upload_pdf,
    "./routes/dashboard/create-agent.tsx": $dashboard_create_agent,
    "./routes/dashboard/create.tsx": $dashboard_create,
    "./routes/dashboard/index.tsx": $dashboard_index,
    "./routes/dashboard/metrics.tsx": $dashboard_metrics,
    "./routes/dashboard/playground.tsx": $dashboard_playground,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/jeff/config.ts": $jeff_config,
    "./routes/jeff/configloader.ts": $jeff_configloader,
    "./routes/jeff/index.tsx": $jeff_index,
    "./routes/jeff/services/scraper/legislationScraper.ts":
      $jeff_services_scraper_legislationScraper,
    "./routes/login.tsx": $login,
    "./routes/maia/config.ts": $maia_config,
    "./routes/maia/index.tsx": $maia_index,
    "./routes/metrics/index.tsx": $metrics_index,
    "./routes/models/index.tsx": $models_index,
    "./routes/petunia/index.tsx": $petunia_index,
  },
  islands: {
    "./islands/AgentEvaluationTable.tsx": $AgentEvaluationTable,
    "./islands/AgentMetricsCard.tsx": $AgentMetricsCard,
    "./islands/AgentPerformanceChart.tsx": $AgentPerformanceChart,
    "./islands/AnimatedBackground.tsx": $AnimatedBackground,
    "./islands/CreateAgentFlow.tsx": $CreateAgentFlow,
    "./islands/CreateAgentFormIsland.tsx": $CreateAgentFormIsland,
    "./islands/CreateAgentSteps/ConfigurationStep.tsx":
      $CreateAgentSteps_ConfigurationStep,
    "./islands/CreateAgentSteps/DeploymentStep.tsx":
      $CreateAgentSteps_DeploymentStep,
    "./islands/CreateAgentSteps/EvaluationStep.tsx":
      $CreateAgentSteps_EvaluationStep,
    "./islands/CreateAgentSteps/IndustryStep.tsx":
      $CreateAgentSteps_IndustryStep,
    "./islands/CreateAgentSteps/ModelConfigStep.tsx":
      $CreateAgentSteps_ModelConfigStep,
    "./islands/CreateAgentSteps/PromptStep.tsx": $CreateAgentSteps_PromptStep,
    "./islands/CreateAgentSteps/SystemPromptStep.tsx":
      $CreateAgentSteps_SystemPromptStep,
    "./islands/CreateAgentSteps/TemplateStep.tsx":
      $CreateAgentSteps_TemplateStep,
    "./islands/CreateAgentSteps/ToolsStep.tsx": $CreateAgentSteps_ToolsStep,
    "./islands/DashboardTabsIsland.tsx": $DashboardTabsIsland,
    "./islands/FeatureHighlight.tsx": $FeatureHighlight,
    "./islands/MetricsPageIsland.tsx": $MetricsPageIsland,
    "./islands/ModelsPageIsland.tsx": $ModelsPageIsland,
    "./islands/NavBar.tsx": $NavBar,
    "./islands/Playground.tsx": $Playground,
    "./islands/agents/Chat.tsx": $agents_Chat,
    "./islands/auth/LoginForm.tsx": $auth_LoginForm,
    "./islands/components/AgentMetricsPanel.tsx": $components_AgentMetricsPanel,
    "./islands/components/ChatMessage.tsx": $components_ChatMessage,
    "./islands/dashboard/AnalyticsDashboard.tsx": $dashboard_AnalyticsDashboard,
    "./islands/dashboard/MetricsPanel.tsx": $dashboard_MetricsPanel,
    "./islands/interfaces/AgentConfig.tsx": $interfaces_AgentConfig,
    "./islands/interfaces/AuthComponent.tsx": $interfaces_AuthComponent,
    "./islands/interfaces/LegalChat.tsx": $interfaces_LegalChat,
    "./islands/interfaces/MaiaChat.tsx": $interfaces_MaiaChat,
    "./islands/interfaces/PetuniaChat.tsx": $interfaces_PetuniaChat,
    "./islands/interfaces/Widget.tsx": $interfaces_Widget,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
