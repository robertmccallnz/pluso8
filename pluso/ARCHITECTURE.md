# Pluso Platform Architecture
2024-12-20T21:48:22.688Z

## Directory Structure
{
  "name": "pluso",
  "type": "directory",
  "children": [
    {
      "name": "fresh.config.ts",
      "type": "file"
    },
    {
      "name": "middleware",
      "type": "directory",
      "children": [
        {
          "name": "rateLimit.ts",
          "type": "file"
        },
        {
          "name": "rate_limiter.ts",
          "type": "file"
        },
        {
          "name": "aiProxy.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "tools",
      "type": "directory",
      "children": [
        {
          "name": "assistants",
          "type": "directory",
          "children": [
            {
              "name": "te-reo",
              "type": "directory",
              "children": [
                {
                  "name": "mod.ts",
                  "type": "file"
                },
                {
                  "name": "grammar.ts",
                  "type": "file"
                },
                {
                  "name": "types.ts",
                  "type": "file"
                },
                {
                  "name": "phrases.ts",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "restructure.ts",
          "type": "file"
        },
        {
          "name": "final-cleanup.ts",
          "type": "file"
        },
        {
          "name": "cleanup.ts",
          "type": "file"
        },
        {
          "name": "scrapers",
          "type": "directory",
          "children": [
            {
              "name": "kupu",
              "type": "directory",
              "children": [
                {
                  "name": "mod.ts",
                  "type": "file"
                },
                {
                  "name": "tests",
                  "type": "directory"
                },
                {
                  "name": "types.ts",
                  "type": "file"
                },
                {
                  "name": "cache.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "tab",
              "type": "directory",
              "children": [
                {
                  "name": "mod.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "legislation",
              "type": "directory",
              "children": [
                {
                  "name": "mod.ts",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "generators",
          "type": "directory",
          "children": [
            {
              "name": "web",
              "type": "directory",
              "children": [
                {
                  "name": "nz-extension.ts",
                  "type": "file"
                },
                {
                  "name": "mod.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "pdf-generator.ts",
              "type": "file"
            }
          ]
        }
      ]
    },
    {
      "name": "ARCHITECTURE.md",
      "type": "file"
    },
    {
      "name": "types",
      "type": "directory",
      "children": [
        {
          "name": "industries.ts",
          "type": "file"
        },
        {
          "name": "routes.ts",
          "type": "file"
        },
        {
          "name": "env.d.ts",
          "type": "file"
        },
        {
          "name": "chat.ts",
          "type": "file"
        },
        {
          "name": "dashboard.ts",
          "type": "file"
        },
        {
          "name": "templates.ts",
          "type": "file"
        },
        {
          "name": "types.ts",
          "type": "file"
        },
        {
          "name": "message.ts",
          "type": "file"
        },
        {
          "name": "order.ts",
          "type": "file"
        },
        {
          "name": "index.ts",
          "type": "file"
        },
        {
          "name": "preact.d.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "core",
      "type": "directory",
      "children": [
        {
          "name": "metrics",
          "type": "directory",
          "children": [
            {
              "name": "verify.ts",
              "type": "file"
            },
            {
              "name": "model-metrics.ts",
              "type": "file"
            },
            {
              "name": "monitor-registry.ts",
              "type": "file"
            },
            {
              "name": "types.ts",
              "type": "file"
            },
            {
              "name": "collector.ts",
              "type": "file"
            },
            {
              "name": "enhanced-transpile-metrics.ts",
              "type": "file"
            },
            {
              "name": "performance-monitor.ts",
              "type": "file"
            },
            {
              "name": "index.ts",
              "type": "file"
            },
            {
              "name": "metrics.ts",
              "type": "file"
            },
            {
              "name": "mock-metrics.ts",
              "type": "file"
            },
            {
              "name": "metrics-manager.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "transpiler",
          "type": "directory",
          "children": [
            {
              "name": "pipeline.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "tools",
          "type": "directory",
          "children": [
            {
              "name": "registry.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "types",
          "type": "directory",
          "children": [
            {
              "name": "agent-analytics.ts",
              "type": "file"
            },
            {
              "name": "dashboard.ts",
              "type": "file"
            },
            {
              "name": "common",
              "type": "directory"
            },
            {
              "name": "index.ts",
              "type": "file"
            },
            {
              "name": "models.ts",
              "type": "file"
            },
            {
              "name": "home.ts",
              "type": "file"
            },
            {
              "name": "responses.ts",
              "type": "file"
            },
            {
              "name": "metrics.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "init.ts",
          "type": "file"
        },
        {
          "name": "memory",
          "type": "directory",
          "children": [
            {
              "name": "manager.ts",
              "type": "file"
            },
            {
              "name": "stream.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "config",
          "type": "directory",
          "children": [
            {
              "name": "agent-validator.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "providers",
          "type": "directory",
          "children": [
            {
              "name": "base.ts",
              "type": "file"
            },
            {
              "name": "together",
              "type": "directory",
              "children": [
                {
                  "name": "client.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "anthropic",
              "type": "directory",
              "children": [
                {
                  "name": "client.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "base",
              "type": "directory",
              "children": [
                {
                  "name": "errir-handler.ts",
                  "type": "file"
                },
                {
                  "name": "model.ts",
                  "type": "file"
                },
                {
                  "name": "client.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "openai",
              "type": "directory",
              "children": [
                {
                  "name": "client.ts",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "async",
          "type": "directory",
          "children": [
            {
              "name": "event-loop.ts",
              "type": "file"
            },
            {
              "name": "advanced-runtime.ts",
              "type": "file"
            },
            {
              "name": "runtime.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "runtime",
          "type": "directory",
          "children": [
            {
              "name": "cache",
              "type": "directory",
              "children": [
                {
                  "name": "module.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "engine.ts",
              "type": "file"
            },
            {
              "name": "isolates",
              "type": "directory",
              "children": [
                {
                  "name": "base.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "optimizers",
              "type": "directory",
              "children": [
                {
                  "name": "v8.ts",
                  "type": "file"
                },
                {
                  "name": "model.ts",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "agents",
          "type": "directory",
          "children": [
            {
              "name": "management",
              "type": "directory"
            },
            {
              "name": "templates",
              "type": "directory"
            },
            {
              "name": "maia",
              "type": "directory",
              "children": [
                {
                  "name": "config.yaml",
                  "type": "file"
                }
              ]
            },
            {
              "name": "communication",
              "type": "directory"
            }
          ]
        },
        {
          "name": "state",
          "type": "directory",
          "children": [
            {
              "name": "index.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "storage",
          "type": "directory"
        },
        {
          "name": "types.ts",
          "type": "file"
        },
        {
          "name": "http",
          "type": "directory",
          "children": [
            {
              "name": "handlers",
              "type": "directory",
              "children": [
                {
                  "name": "base.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "router",
              "type": "directory",
              "children": [
                {
                  "name": "fresh.gen.ts",
                  "type": "file"
                },
                {
                  "name": "main.ts",
                  "type": "file"
                },
                {
                  "name": "routes",
                  "type": "directory"
                }
              ]
            }
          ]
        },
        {
          "name": "ai",
          "type": "directory",
          "children": [
            {
              "name": "agent-network.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "deployment",
          "type": "directory",
          "children": [
            {
              "name": "config-generator.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "workers",
          "type": "directory",
          "children": [
            {
              "name": "tasks",
              "type": "directory",
              "children": [
                {
                  "name": "base.ts",
                  "type": "file"
                },
                {
                  "name": "legistration-scraper.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "agents",
              "type": "directory"
            },
            {
              "name": "errors",
              "type": "directory",
              "children": [
                {
                  "name": "handler.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "pool",
              "type": "directory",
              "children": [
                {
                  "name": "manager.ts",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "config.ts",
          "type": "file"
        },
        {
          "name": "monitoring",
          "type": "directory",
          "children": [
            {
              "name": "performance.ts",
              "type": "file"
            },
            {
              "name": "transpiler.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "modules",
          "type": "directory",
          "children": [
            {
              "name": "manager.ts",
              "type": "file"
            },
            {
              "name": "upgrader.ts",
              "type": "file"
            },
            {
              "name": "resolver.ts",
              "type": "file"
            },
            {
              "name": "loader.ts",
              "type": "file"
            },
            {
              "name": "types.ts",
              "type": "file"
            },
            {
              "name": "registry.ts",
              "type": "file"
            },
            {
              "name": "version.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "seo",
          "type": "directory",
          "children": [
            {
              "name": "config.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "services",
          "type": "directory",
          "children": [
            {
              "name": "agent-analytics.ts",
              "type": "file"
            },
            {
              "name": "user.service.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "buffer",
          "type": "directory",
          "children": [
            {
              "name": "manager.ts",
              "type": "file"
            },
            {
              "name": "pool.ts",
              "type": "file"
            },
            {
              "name": "optimizer.ts",
              "type": "file"
            },
            {
              "name": "zero-copy.ts",
              "type": "file"
            }
          ]
        }
      ]
    },
    {
      "name": "fresh.gen.ts",
      "type": "file"
    },
    {
      "name": "main.ts",
      "type": "file"
    },
    {
      "name": "vercel.json",
      "type": "file"
    },
    {
      "name": "dev.ts",
      "type": "file"
    },
    {
      "name": "debug-manifest.ts",
      "type": "file"
    },
    {
      "name": "config",
      "type": "directory",
      "children": [
        {
          "name": "models.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "Dockerfile",
      "type": "file"
    },
    {
      "name": "global.css",
      "type": "file"
    },
    {
      "name": "twind.config.ts",
      "type": "file"
    },
    {
      "name": "tests",
      "type": "directory",
      "children": [
        {
          "name": "mocks",
          "type": "directory",
          "children": [
            {
              "name": "websocket.mock.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "transpiler.test.ts",
          "type": "file"
        },
        {
          "name": "unit",
          "type": "directory",
          "children": [
            {
              "name": "component-analyzer.test.ts",
              "type": "file"
            },
            {
              "name": "file-trigger.test.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "chat_formatting_test.ts",
          "type": "file"
        },
        {
          "name": "websockets.test.ts",
          "type": "file"
        },
        {
          "name": "auth.test.ts",
          "type": "file"
        },
        {
          "name": "test_helpers.ts",
          "type": "file"
        },
        {
          "name": "metrics.test.ts",
          "type": "file"
        },
        {
          "name": "model_inference_test.ts",
          "type": "file"
        },
        {
          "name": "integration",
          "type": "directory",
          "children": [
            {
              "name": "component-rendering.test.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "test_config.ts",
          "type": "file"
        },
        {
          "name": "wizard",
          "type": "directory",
          "children": [
            {
              "name": "test-helpers.ts",
              "type": "file"
            },
            {
              "name": "agent-creation-wizard.test.tsx",
              "type": "file"
            },
            {
              "name": "steps",
              "type": "directory",
              "children": [
                {
                  "name": "evaluation-step.test.tsx",
                  "type": "file"
                },
                {
                  "name": "model-step.test.tsx",
                  "type": "file"
                },
                {
                  "name": "config-step.test.tsx",
                  "type": "file"
                },
                {
                  "name": "template-step.test.tsx",
                  "type": "file"
                },
                {
                  "name": "use-case-step.test.tsx",
                  "type": "file"
                },
                {
                  "name": "test-step.test.tsx",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "deno.json",
          "type": "file"
        },
        {
          "name": "islands",
          "type": "directory",
          "children": [
            {
              "name": "test",
              "type": "directory",
              "children": [
                {
                  "name": "TestSignals.tsx",
                  "type": "file"
                },
                {
                  "name": "TestIsland.tsx",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "agent_test.ts",
          "type": "file"
        },
        {
          "name": "filepaths.test.ts",
          "type": "file"
        },
        {
          "name": "dashboard",
          "type": "directory",
          "children": [
            {
              "name": "analytics-dashboard.test.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "websocket_test.ts",
          "type": "file"
        },
        {
          "name": "agent-config.test.ts",
          "type": "file"
        },
        {
          "name": "agent_config.ts",
          "type": "file"
        },
        {
          "name": "rendering.test.ts",
          "type": "file"
        },
        {
          "name": "agent-analytics.test.ts",
          "type": "file"
        },
        {
          "name": "scripts",
          "type": "directory",
          "children": [
            {
              "name": "check-rendering.ts",
              "type": "file"
            },
            {
              "name": "fix-components.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "upgrader",
          "type": "directory",
          "children": [
            {
              "name": "test-utils.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "import_map.json",
          "type": "file"
        },
        {
          "name": "signal.test.ts",
          "type": "file"
        },
        {
          "name": "component-fixes.test.ts",
          "type": "file"
        },
        {
          "name": "maia_chat_test.ts",
          "type": "file"
        },
        {
          "name": "routes",
          "type": "directory",
          "children": [
            {
              "name": "test-island.tsx",
              "type": "file"
            },
            {
              "name": "test-signals.tsx",
              "type": "file"
            },
            {
              "name": "test.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "helpers",
          "type": "directory",
          "children": [
            {
              "name": "component-analyzer.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "widget_test.ts",
          "type": "file"
        },
        {
          "name": "api.test.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "deno.json",
      "type": "file"
    },
    {
      "name": "islands",
      "type": "directory",
      "children": [
        {
          "name": "MetricsPage.tsx",
          "type": "file"
        },
        {
          "name": "AgentMetricsCard.tsx",
          "type": "file"
        },
        {
          "name": "AgentEvaluationTable.tsx",
          "type": "file"
        },
        {
          "name": "tools",
          "type": "directory",
          "children": [
            {
              "name": "WebTools.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "types",
          "type": "directory",
          "children": [
            {
              "name": "chat.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "DashboardTabs.tsx",
          "type": "file"
        },
        {
          "name": "DashboardContent.tsx",
          "type": "file"
        },
        {
          "name": "auth",
          "type": "directory"
        },
        {
          "name": "DeploymentIsland.tsx",
          "type": "file"
        },
        {
          "name": "RTCMetricsConnection.tsx",
          "type": "file"
        },
        {
          "name": "Examples.tsx",
          "type": "file"
        },
        {
          "name": "admin",
          "type": "directory",
          "children": [
            {
              "name": "AdminDashboard.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "agents",
          "type": "directory",
          "children": [
            {
              "name": "petunia",
              "type": "directory",
              "children": [
                {
                  "name": "PetuniaPage.tsx",
                  "type": "file"
                },
                {
                  "name": "PetuniaWidget.tsx",
                  "type": "file"
                },
                {
                  "name": "config.yaml",
                  "type": "file"
                }
              ]
            },
            {
              "name": "jeff",
              "type": "directory",
              "children": [
                {
                  "name": "JeffWidget.tsx",
                  "type": "file"
                },
                {
                  "name": "config.yaml",
                  "type": "file"
                },
                {
                  "name": "JeffPage.tsx",
                  "type": "file"
                }
              ]
            },
            {
              "name": "maia",
              "type": "directory",
              "children": [
                {
                  "name": "MaiaWebTools.tsx",
                  "type": "file"
                },
                {
                  "name": "MaiaPage.tsx",
                  "type": "file"
                },
                {
                  "name": "tools",
                  "type": "directory"
                },
                {
                  "name": "config.yaml",
                  "type": "file"
                },
                {
                  "name": "MaiaWidget.tsx",
                  "type": "file"
                }
              ]
            },
            {
              "name": "Chat.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "utils",
          "type": "directory"
        },
        {
          "name": "ModelsPage.tsx",
          "type": "file"
        },
        {
          "name": "AgentPerformanceChart.tsx",
          "type": "file"
        },
        {
          "name": "dashboard",
          "type": "directory",
          "children": [
            {
              "name": "AgentMetricsDashboard.tsx",
              "type": "file"
            },
            {
              "name": "AgentDetails.tsx",
              "type": "file"
            },
            {
              "name": "Overview.tsx",
              "type": "file"
            },
            {
              "name": "DashboardNavigation.tsx",
              "type": "file"
            },
            {
              "name": "Playground.tsx",
              "type": "file"
            },
            {
              "name": "components",
              "type": "directory",
              "children": [
                {
                  "name": "charts",
                  "type": "directory"
                }
              ]
            },
            {
              "name": "AnalyticsDashboard.tsx",
              "type": "file"
            },
            {
              "name": "MetricsPanel.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "components",
          "type": "directory",
          "children": [
            {
              "name": "AgentMetricsPanel.tsx",
              "type": "file"
            },
            {
              "name": "ChatMessage.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "AgentCreation",
          "type": "directory",
          "children": [
            {
              "name": "utils",
              "type": "directory",
              "children": [
                {
                  "name": "yamlValidator.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "api.ts",
              "type": "file"
            },
            {
              "name": "types.ts",
              "type": "file"
            },
            {
              "name": "steps",
              "type": "directory",
              "children": [
                {
                  "name": "ReviewAndCreate.tsx",
                  "type": "file"
                },
                {
                  "name": "ModeSelection.tsx",
                  "type": "file"
                },
                {
                  "name": "TypeSelection.tsx",
                  "type": "file"
                },
                {
                  "name": "IndustrySelection.tsx",
                  "type": "file"
                },
                {
                  "name": "YamlEditor.tsx",
                  "type": "file"
                },
                {
                  "name": "ModelSelection.tsx",
                  "type": "file"
                }
              ]
            },
            {
              "name": "AgentWizard.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "CreateAgentFlow.tsx",
          "type": "file"
        },
        {
          "name": "DeployAgent.tsx",
          "type": "file"
        },
        {
          "name": "LoadingStateIsland.tsx",
          "type": "file"
        },
        {
          "name": "FeatureHighlight.tsx",
          "type": "file"
        },
        {
          "name": "AnimatedBackground.tsx",
          "type": "file"
        },
        {
          "name": "interfaces",
          "type": "directory",
          "children": [
            {
              "name": "PetuniaChat.tsx",
              "type": "file"
            },
            {
              "name": "MaiaChat.tsx",
              "type": "file"
            },
            {
              "name": "JeffChat.tsx",
              "type": "file"
            },
            {
              "name": "AgentConfig.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "MetricsGraph.tsx",
          "type": "file"
        }
      ]
    },
    {
      "name": "agents",
      "type": "directory",
      "children": [
        {
          "name": "types",
          "type": "directory",
          "children": [
            {
              "name": "agent.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "core",
          "type": "directory",
          "children": [
            {
              "name": "registry.ts",
              "type": "file"
            }
          ]
        }
      ]
    },
    {
      "name": "utils",
      "type": "directory",
      "children": [
        {
          "name": "websocket.ts",
          "type": "file"
        },
        {
          "name": "routes.ts",
          "type": "file"
        },
        {
          "name": "stripe.ts",
          "type": "file"
        },
        {
          "name": "puppeteer.ts",
          "type": "file"
        },
        {
          "name": "chart-config.ts",
          "type": "file"
        },
        {
          "name": "permissions.ts",
          "type": "file"
        },
        {
          "name": "fetch-utils.ts",
          "type": "file"
        },
        {
          "name": "formatters",
          "type": "directory",
          "children": [
            {
              "name": "agent-response.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "debug-head.ts",
          "type": "file"
        },
        {
          "name": "chat_formatting.ts",
          "type": "file"
        },
        {
          "name": "apiKeys.ts",
          "type": "file"
        },
        {
          "name": "chart.ts",
          "type": "file"
        },
        {
          "name": "supabase.ts",
          "type": "file"
        },
        {
          "name": "env.ts",
          "type": "file"
        },
        {
          "name": "config.ts",
          "type": "file"
        },
        {
          "name": "load-env.ts",
          "type": "file"
        },
        {
          "name": "db.ts",
          "type": "file"
        },
        {
          "name": "auth.ts",
          "type": "file"
        },
        {
          "name": "monitored_websocket.ts",
          "type": "file"
        },
        {
          "name": "websocket_service.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "shared",
      "type": "directory"
    },
    {
      "name": "models",
      "type": "directory",
      "children": [
        {
          "name": "chat.ts",
          "type": "file"
        },
        {
          "name": "factory.ts",
          "type": "file"
        },
        {
          "name": "config.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "cookies.txt",
      "type": "file"
    },
    {
      "name": "docs",
      "type": "directory",
      "children": [
        {
          "name": "index.md",
          "type": "file"
        },
        {
          "name": "agent-types.md",
          "type": "file"
        }
      ]
    },
    {
      "name": "cleanup.ts",
      "type": "file"
    },
    {
      "name": "README.md",
      "type": "file"
    },
    {
      "name": "tailwind.config.ts",
      "type": "file"
    },
    {
      "name": "styles",
      "type": "directory",
      "children": [
        {
          "name": "theme.css",
          "type": "file"
        }
      ]
    },
    {
      "name": "components",
      "type": "directory",
      "children": [
        {
          "name": "ui",
          "type": "directory",
          "children": [
            {
              "name": "CustomButton.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "NavBar.tsx",
          "type": "file"
        },
        {
          "name": "collaboration",
          "type": "directory",
          "children": [
            {
              "name": "RealTimeCollaboration.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "CompareModels.tsx",
          "type": "file"
        },
        {
          "name": "multi-agent",
          "type": "directory",
          "children": [
            {
              "name": "AgentPermissions.ts",
              "type": "file"
            },
            {
              "name": "MultiAgentConfig.tsx",
              "type": "file"
            },
            {
              "name": "TaskRouter.ts",
              "type": "file"
            },
            {
              "name": "AgentOrchestrator.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "SEO.tsx",
          "type": "file"
        },
        {
          "name": "ModelFilter.tsx",
          "type": "file"
        },
        {
          "name": "MainLayout.tsx",
          "type": "file"
        },
        {
          "name": "dashboard",
          "type": "directory",
          "children": [
            {
              "name": "TemplateManager.tsx",
              "type": "file"
            },
            {
              "name": "IndustryTemplateSelector.tsx",
              "type": "file"
            },
            {
              "name": "EnhancedAnalytics.tsx",
              "type": "file"
            },
            {
              "name": "IndustryTemplates.ts",
              "type": "file"
            },
            {
              "name": "ApiKeyManager.tsx",
              "type": "file"
            },
            {
              "name": "ModelPresets.ts",
              "type": "file"
            },
            {
              "name": "ModelTemplate.tsx",
              "type": "file"
            },
            {
              "name": "TemplateSharing.tsx",
              "type": "file"
            },
            {
              "name": "TemplateRecommendations.ts",
              "type": "file"
            },
            {
              "name": "ModelSelector.tsx",
              "type": "file"
            },
            {
              "name": "BatchTesting.tsx",
              "type": "file"
            },
            {
              "name": "types.ts",
              "type": "file"
            },
            {
              "name": "AgentDashboard.tsx",
              "type": "file"
            },
            {
              "name": "TemplateAnalytics.tsx",
              "type": "file"
            },
            {
              "name": "ModelPreview.tsx",
              "type": "file"
            },
            {
              "name": "TemplateExportImport.ts",
              "type": "file"
            },
            {
              "name": "ModelValidation.ts",
              "type": "file"
            },
            {
              "name": "WorkflowBuilder.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "rlhf",
          "type": "directory",
          "children": [
            {
              "name": "EnhancedRLHFDashboard.tsx",
              "type": "file"
            },
            {
              "name": "RLHFTrainer.ts",
              "type": "file"
            },
            {
              "name": "LLMJudge.ts",
              "type": "file"
            },
            {
              "name": "BiasDetector.ts",
              "type": "file"
            },
            {
              "name": "ABTesting.ts",
              "type": "file"
            },
            {
              "name": "FeedbackCalibrator.ts",
              "type": "file"
            },
            {
              "name": "FeedbackCollector.ts",
              "type": "file"
            },
            {
              "name": "RLHFDashboard.tsx",
              "type": "file"
            },
            {
              "name": "AutomatedRLHFDashboard.tsx",
              "type": "file"
            },
            {
              "name": "AutomatedRLHF.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "ModelCard.tsx",
          "type": "file"
        },
        {
          "name": "agent-creation",
          "type": "directory",
          "children": [
            {
              "name": "AgentCreationFlow.ts",
              "type": "file"
            },
            {
              "name": "AgentCreationWizard.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "icons",
          "type": "directory",
          "children": [
            {
              "name": "Download.tsx",
              "type": "file"
            },
            {
              "name": "Refresh.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "templates",
          "type": "directory",
          "children": [
            {
              "name": "AgentTemplates.ts",
              "type": "file"
            },
            {
              "name": "GolfMemberEngagement.ts",
              "type": "file"
            },
            {
              "name": "TemplateAnalytics.ts",
              "type": "file"
            },
            {
              "name": "GolfFacilitiesManagement.ts",
              "type": "file"
            },
            {
              "name": "GolfClubTemplates.ts",
              "type": "file"
            },
            {
              "name": "MembershipTemplates.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "ServicesList.tsx",
          "type": "file"
        },
        {
          "name": "SideBar.tsx",
          "type": "file"
        },
        {
          "name": "Button.tsx",
          "type": "file"
        },
        {
          "name": "ChatMessage.tsx",
          "type": "file"
        },
        {
          "name": "SEOHandler.tsx",
          "type": "file"
        },
        {
          "name": "analytics",
          "type": "directory",
          "children": [
            {
              "name": "PerformanceAnalytics.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "debug",
          "type": "directory",
          "children": [
            {
              "name": "AgentDebugger.ts",
              "type": "file"
            }
          ]
        }
      ]
    },
    {
      "name": "deno.lock",
      "type": "file"
    },
    {
      "name": "logs",
      "type": "directory",
      "children": [
        {
          "name": "api-tests.log",
          "type": "file"
        },
        {
          "name": "daily-tests.log",
          "type": "file"
        },
        {
          "name": "filepath-tests.log",
          "type": "file"
        },
        {
          "name": "websocket-tests.log",
          "type": "file"
        }
      ]
    },
    {
      "name": "sdk",
      "type": "directory",
      "children": [
        {
          "name": "ultravox-client",
          "type": "directory",
          "children": [
            {
              "name": "dist",
              "type": "directory",
              "children": [
                {
                  "name": "tests",
                  "type": "directory"
                },
                {
                  "name": "src",
                  "type": "directory"
                }
              ]
            },
            {
              "name": "jest.config.js",
              "type": "file"
            },
            {
              "name": "tests",
              "type": "directory",
              "children": [
                {
                  "name": "MaiaAgent.test.ts",
                  "type": "file"
                },
                {
                  "name": "UltravoxSession.test.ts",
                  "type": "file"
                },
                {
                  "name": "integration",
                  "type": "directory"
                },
                {
                  "name": "setup.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "deno.lock",
              "type": "file"
            },
            {
              "name": "package-lock.json",
              "type": "file"
            },
            {
              "name": "package.json",
              "type": "file"
            },
            {
              "name": "tsconfig.json",
              "type": "file"
            },
            {
              "name": "src",
              "type": "directory",
              "children": [
                {
                  "name": "tools",
                  "type": "directory"
                },
                {
                  "name": "agents",
                  "type": "directory"
                },
                {
                  "name": "types.ts",
                  "type": "file"
                },
                {
                  "name": "UltravoxSession.ts",
                  "type": "file"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": ".env",
      "type": "file"
    },
    {
      "name": "static",
      "type": "directory",
      "children": [
        {
          "name": "icon-192x192.png",
          "type": "file"
        },
        {
          "name": "favicon.ico",
          "type": "file"
        },
        {
          "name": "screenshots",
          "type": "directory"
        },
        {
          "name": "styles.css",
          "type": "file"
        },
        {
          "name": "jeff-avatar.svg",
          "type": "file"
        },
        {
          "name": "icons",
          "type": "directory",
          "children": [
            {
              "name": "meta.svg",
              "type": "file"
            },
            {
              "name": "openai.svg",
              "type": "file"
            },
            {
              "name": "midjourney.svg",
              "type": "file"
            },
            {
              "name": "mistral.svg",
              "type": "file"
            },
            {
              "name": "flux.svg",
              "type": "file"
            },
            {
              "name": "google.svg",
              "type": "file"
            },
            {
              "name": "anthropic.svg",
              "type": "file"
            },
            {
              "name": "stability.svg",
              "type": "file"
            }
          ]
        },
        {
          "name": "manifest.json",
          "type": "file"
        },
        {
          "name": "icon-512x512.png",
          "type": "file"
        },
        {
          "name": "pdfs",
          "type": "directory"
        },
        {
          "name": "jeff-photo.jpg",
          "type": "file"
        },
        {
          "name": "templates",
          "type": "directory",
          "children": [
            {
              "name": "technology",
              "type": "directory",
              "children": [
                {
                  "name": "code-assistant.yaml",
                  "type": "file"
                },
                {
                  "name": "technical-support.yaml",
                  "type": "file"
                }
              ]
            },
            {
              "name": "customer-service",
              "type": "directory",
              "children": [
                {
                  "name": "support-agent.yaml",
                  "type": "file"
                }
              ]
            },
            {
              "name": "healthcare",
              "type": "directory",
              "children": [
                {
                  "name": "patient-communication.yaml",
                  "type": "file"
                },
                {
                  "name": "medical-analysis.yaml",
                  "type": "file"
                }
              ]
            },
            {
              "name": "education",
              "type": "directory",
              "children": [
                {
                  "name": "tutoring.yaml",
                  "type": "file"
                }
              ]
            },
            {
              "name": "finance",
              "type": "directory",
              "children": [
                {
                  "name": "fraud-detection.yaml",
                  "type": "file"
                },
                {
                  "name": "investment-advisory.yaml",
                  "type": "file"
                }
              ]
            },
            {
              "name": "legal",
              "type": "directory",
              "children": [
                {
                  "name": "contract-analysis.yaml",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "avatars",
          "type": "directory"
        },
        {
          "name": "data",
          "type": "directory",
          "children": [
            {
              "name": "templates.json",
              "type": "file"
            },
            {
              "name": "industries.json",
              "type": "file"
            }
          ]
        },
        {
          "name": "logo.svg",
          "type": "file"
        }
      ]
    },
    {
      "name": "deployment",
      "type": "directory"
    },
    {
      "name": "hooks",
      "type": "directory",
      "children": [
        {
          "name": "useAnalytics.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "update-imports.ts",
      "type": "file"
    },
    {
      "name": "component-map.ts",
      "type": "file"
    },
    {
      "name": "scripts",
      "type": "directory",
      "children": [
        {
          "name": "subhosting.ts",
          "type": "file"
        },
        {
          "name": "websocket_manager.ts",
          "type": "file"
        },
        {
          "name": "update-architecture.ts",
          "type": "file"
        },
        {
          "name": "test_together_simple.ts",
          "type": "file"
        },
        {
          "name": "diagnose-server.ts",
          "type": "file"
        },
        {
          "name": "reorganize.ts",
          "type": "file"
        },
        {
          "name": "check-server-status.ts",
          "type": "file"
        },
        {
          "name": "debug-server.ts",
          "type": "file"
        },
        {
          "name": "test_together.ts",
          "type": "file"
        },
        {
          "name": "cleanup.ts",
          "type": "file"
        },
        {
          "name": "daily-tests.sh",
          "type": "file"
        },
        {
          "name": "crontab.txt",
          "type": "file"
        },
        {
          "name": "check_duplicates.ts",
          "type": "file"
        },
        {
          "name": "check-server.ts",
          "type": "file"
        },
        {
          "name": "verify_imports.ts",
          "type": "file"
        },
        {
          "name": "update-islands.ts",
          "type": "file"
        },
        {
          "name": "debug-500.ts",
          "type": "file"
        },
        {
          "name": "update-tsx.ts",
          "type": "file"
        },
        {
          "name": "check_agents.ts",
          "type": "file"
        },
        {
          "name": "test_together_chat.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "lib",
      "type": "directory",
      "children": [
        {
          "name": "types",
          "type": "directory",
          "children": [
            {
              "name": "message-formatting.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "config",
          "type": "directory",
          "children": [
            {
              "name": "cohere.ts",
              "type": "file"
            },
            {
              "name": "together.ts",
              "type": "file"
            },
            {
              "name": "anthropic.ts",
              "type": "file"
            },
            {
              "name": "openai.ts",
              "type": "file"
            },
            {
              "name": "mistral.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "constants",
          "type": "directory",
          "children": [
            {
              "name": "styles.ts",
              "type": "file"
            },
            {
              "name": "tools.ts",
              "type": "file"
            },
            {
              "name": "models.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "utils.ts",
          "type": "file"
        },
        {
          "name": "utils",
          "type": "directory",
          "children": [
            {
              "name": "message-formatter.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "clientTools.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "metrics.db",
      "type": "file"
    },
    {
      "name": "db",
      "type": "directory",
      "children": [
        {
          "name": "migrations",
          "type": "directory",
          "children": [
            {
              "name": "20241220_add_user_agents_and_api_keys.sql",
              "type": "file"
            }
          ]
        },
        {
          "name": "init.ts",
          "type": "file"
        },
        {
          "name": "schema.sql",
          "type": "file"
        }
      ]
    },
    {
      "name": "components.json",
      "type": "file"
    },
    {
      "name": "tsconfig.json",
      "type": "file"
    },
    {
      "name": "docker-compose.test.yml",
      "type": "file"
    },
    {
      "name": "monitoring",
      "type": "directory"
    },
    {
      "name": ".vscode",
      "type": "directory",
      "children": [
        {
          "name": "tailwind.json",
          "type": "file"
        },
        {
          "name": "settings.json",
          "type": "file"
        },
        {
          "name": "extensions.json",
          "type": "file"
        }
      ]
    },
    {
      "name": "deps.ts",
      "type": "file"
    },
    {
      "name": "kong.yml",
      "type": "file"
    },
    {
      "name": "server.ts",
      "type": "file"
    },
    {
      "name": "routes",
      "type": "directory",
      "children": [
        {
          "name": "settings.tsx",
          "type": "file"
        },
        {
          "name": "index.tsx",
          "type": "file"
        },
        {
          "name": "settings",
          "type": "directory",
          "children": [
            {
              "name": "index.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "tools",
          "type": "directory",
          "children": [
            {
              "name": "screenshot.tsx",
              "type": "file"
            },
            {
              "name": "seo.tsx",
              "type": "file"
            },
            {
              "name": "form-filler.tsx",
              "type": "file"
            },
            {
              "name": "monitor.tsx",
              "type": "file"
            },
            {
              "name": "scraper.tsx",
              "type": "file"
            },
            {
              "name": "pdf.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "dashboard.tsx",
          "type": "file"
        },
        {
          "name": "_error.tsx",
          "type": "file"
        },
        {
          "name": "contact.tsx",
          "type": "file"
        },
        {
          "name": "tools.tsx",
          "type": "file"
        },
        {
          "name": "admin",
          "type": "directory",
          "children": [
            {
              "name": "index.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "agents",
          "type": "directory"
        },
        {
          "name": "_middleware.ts",
          "type": "file"
        },
        {
          "name": "dashboard",
          "type": "directory",
          "children": [
            {
              "name": "settings.tsx",
              "type": "file"
            },
            {
              "name": "index.tsx",
              "type": "file"
            },
            {
              "name": "metrics",
              "type": "directory",
              "children": [
                {
                  "name": "index.tsx",
                  "type": "file"
                }
              ]
            },
            {
              "name": "create.tsx",
              "type": "file"
            },
            {
              "name": "agents",
              "type": "directory",
              "children": [
                {
                  "name": "index.tsx",
                  "type": "file"
                },
                {
                  "name": "deploy",
                  "type": "directory"
                },
                {
                  "name": "examples.tsx",
                  "type": "file"
                },
                {
                  "name": "[id].tsx",
                  "type": "file"
                }
              ]
            },
            {
              "name": "models",
              "type": "directory",
              "children": [
                {
                  "name": "index.tsx",
                  "type": "file"
                }
              ]
            },
            {
              "name": "playground.tsx",
              "type": "file"
            },
            {
              "name": "_islands.tsx",
              "type": "file"
            },
            {
              "name": "profile.tsx",
              "type": "file"
            },
            {
              "name": "_layout.tsx",
              "type": "file"
            },
            {
              "name": "monitoring",
              "type": "directory",
              "children": [
                {
                  "name": "index.tsx",
                  "type": "file"
                }
              ]
            },
            {
              "name": "analytics",
              "type": "directory",
              "children": [
                {
                  "name": "index.tsx",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "components",
          "type": "directory"
        },
        {
          "name": "test.ts",
          "type": "file"
        },
        {
          "name": "profile.tsx",
          "type": "file"
        },
        {
          "name": "_layout.tsx",
          "type": "file"
        },
        {
          "name": "api",
          "type": "directory",
          "children": [
            {
              "name": "metrics",
              "type": "directory",
              "children": [
                {
                  "name": "verify.ts",
                  "type": "file"
                },
                {
                  "name": "record.ts",
                  "type": "file"
                },
                {
                  "name": "index.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "settings",
              "type": "directory"
            },
            {
              "name": "ping.ts",
              "type": "file"
            },
            {
              "name": "chat",
              "type": "directory",
              "children": [
                {
                  "name": "maia.ts",
                  "type": "file"
                },
                {
                  "name": "jeff.ts",
                  "type": "file"
                },
                {
                  "name": "petunia.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "settings.ts",
              "type": "file"
            },
            {
              "name": "health",
              "type": "directory",
              "children": [
                {
                  "name": "islands.ts",
                  "type": "file"
                },
                {
                  "name": "metrics.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "admin",
              "type": "directory",
              "children": [
                {
                  "name": "agents.ts",
                  "type": "file"
                },
                {
                  "name": "users.ts",
                  "type": "file"
                },
                {
                  "name": "system.ts",
                  "type": "file"
                },
                {
                  "name": "metrics.ts",
                  "type": "file"
                }
              ]
            },
            {
              "name": "agents",
              "type": "directory",
              "children": [
                {
                  "name": "steps",
                  "type": "directory"
                },
                {
                  "name": "initialize.ts",
                  "type": "file"
                },
                {
                  "name": "[id]",
                  "type": "directory"
                }
              ]
            },
            {
              "name": "dashboard.ts",
              "type": "file"
            },
            {
              "name": "agents.ts",
              "type": "file"
            },
            {
              "name": "dashboard",
              "type": "directory"
            },
            {
              "name": "test.ts",
              "type": "file"
            },
            {
              "name": "profile",
              "type": "directory"
            },
            {
              "name": "agent-metrics.ts",
              "type": "file"
            },
            {
              "name": "profile.ts",
              "type": "file"
            },
            {
              "name": "health.ts",
              "type": "file"
            },
            {
              "name": "index.ts",
              "type": "file"
            },
            {
              "name": "models.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "_app.tsx",
          "type": "file"
        },
        {
          "name": "ws",
          "type": "directory",
          "children": [
            {
              "name": "metrics",
              "type": "directory"
            },
            {
              "name": "agents",
              "type": "directory",
              "children": [
                {
                  "name": "chat.ts",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "name": "about.tsx",
          "type": "file"
        },
        {
          "name": "hello.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "build.ts",
      "type": "file"
    }
  ]
}

## Service Agents Framework

### Overview
The platform uses a Service Agents Framework to handle core functionalities through specialized agents:

1. **Router Agent**
   - Manages API routes and endpoints
   - Generates route files automatically
   - Handles request routing and validation
   - Monitors route health

2. **Tooling Agent**
   - Configures and manages tools for other agents
   - Generates tool wrappers
   - Handles tool validation and testing
   - Monitors tool health

3. **Calendar Agent**
   - Manages appointments and scheduling
   - Handles calendar integrations
   - Processes scheduling requests
   - Sends calendar notifications

4. **Email Agent**
   - Handles email communications
   - Manages email templates
   - Processes email triggers
   - Tracks email metrics

5. **Monitor Agent**
   - Watches for code changes
   - Enforces architectural patterns
   - Alerts on potential issues
   - Monitors service health

### Service Agent Registry
```typescript
interface ServiceRegistry {
  registerAgent(agent: ServiceAgent): Promise<void>;
  deregisterAgent(agentId: string): Promise<void>;
  getAgent(type: ServiceAgentType): Promise<ServiceAgent | null>;
  getAllAgents(): Promise<ServiceAgent[]>;
}
```

### Triggers and Events
Service agents use an event-driven architecture:
```typescript
interface ServiceTrigger {
  id: string;
  agentType: ServiceAgentType;
  event: string;
  condition: string;
  action: string;
  priority: number;
}
```

### Database Schema
```sql
CREATE TABLE service_agents (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    metrics JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE service_triggers (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES service_agents(id),
    event VARCHAR(100) NOT NULL,
    condition TEXT,
    action TEXT NOT NULL,
    priority INTEGER DEFAULT 0
);
```

### Usage Guidelines

1. **Creating New Agents**
   - ALWAYS check ServiceRegistry for existing agents
   - Use existing agents through their interfaces
   - Create new triggers instead of new agents
   - Follow the service agent patterns

2. **Adding Functionality**
   - Add triggers to existing agents
   - Extend agent capabilities through tools
   - Use the monitoring system
   - Follow event-driven patterns

3. **Code Changes**
   - Monitor Agent will alert on pattern violations
   - Check ARCHITECTURE.md for existing services
   - Use ServiceRegistry for agent access
   - Follow established patterns

4. **Integration**
   ```typescript
   // Example: Using service agents
   const registry = ServiceRegistry.getInstance();
   
   // Get email agent
   const emailAgent = await registry.getAgent(ServiceAgentType.EMAIL);
   
   // Create trigger
   await emailAgent.addTrigger({
     event: "user:registered",
     action: "send_welcome_email",
     priority: 1
   });
   ```

## Components

### fresh.config.ts
- Path: /fresh.config.ts
- Exports: 
- Dependencies: $fresh/server.ts, $fresh/plugins/twind.ts, ./twind.config.ts


### rateLimit.ts
- Path: /middleware/rateLimit.ts
- Exports: rateLimit
- Dependencies: $fresh/server.ts


### rate_limiter.ts
- Path: /middleware/rate_limiter.ts
- Exports: 
- Dependencies: $fresh/server.ts, @preact/signals


### aiProxy.ts
- Path: /middleware/aiProxy.ts
- Exports: aiProxy
- Dependencies: $fresh/server.ts


### mod.ts
- Path: /tools/assistants/te-reo/mod.ts
- Exports: TeReoAssistant, WebForgeNZ, createNZWebForgeInstance, createTeReoAssistant, nzExtension
- Dependencies: ../kupu-scraper/mod.ts, ./types.ts, ./phrases.ts


### grammar.ts
- Path: /tools/assistants/te-reo/grammar.ts
- Exports: basicPatterns, verbTenses, particles, possessives, questions, sentencePatterns, checkGrammarPattern, suggestCorrection
- Dependencies: 


### types.ts
- Path: /tools/assistants/te-reo/types.ts
- Exports: TeReoError
- Dependencies: 


### phrases.ts
- Path: /tools/assistants/te-reo/phrases.ts
- Exports: CommonPhrases
- Dependencies: 


### restructure.ts
- Path: /tools/restructure.ts
- Exports: 
- Dependencies: https://deno.land/std/fs/walk.ts, https://deno.land/std/path/mod.ts


### final-cleanup.ts
- Path: /tools/final-cleanup.ts
- Exports: 
- Dependencies: 


### cleanup.ts
- Path: /tools/cleanup.ts
- Exports: 
- Dependencies: jsr:@std/fs/walk


### mod.ts
- Path: /tools/scrapers/kupu/mod.ts
- Exports: KupuScraperError, KupuScraper
- Dependencies: https://deno.land/x/deno_dom/deno-dom-wasm.ts


### scraper.test.ts
- Path: /tools/scrapers/kupu/tests/scraper.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.224.0/assert/mod.ts, ../mod.ts, ../types.ts


### types.ts
- Path: /tools/scrapers/kupu/types.ts
- Exports: KupuScraperError
- Dependencies: 


### cache.ts
- Path: /tools/scrapers/kupu/cache.ts
- Exports: MemoryCache, BlobCache, createCache
- Dependencies: @vercel/blob, ./types.ts


### mod.ts
- Path: /tools/scrapers/tab/mod.ts
- Exports: TabScraper
- Dependencies: 


### mod.ts
- Path: /tools/scrapers/legislation/mod.ts
- Exports: LegislationScraper
- Dependencies: 


### nz-extension.ts
- Path: /tools/generators/web/nz-extension.ts
- Exports: WebForgeNZ, createNZWebForgeInstance, nzExtension
- Dependencies: 


### mod.ts
- Path: /tools/generators/web/mod.ts
- Exports: WebForge, createWebForgeInstance, validateConfig
- Dependencies: https://deno.land/x/esbuild@v0.19.4/mod.js, https://deno.land/std@0.208.0/fs/ensure_dir.ts, https://deno.land/std@0.208.0/path/mod.ts, react


### pdf-generator.ts
- Path: /tools/generators/pdf-generator.ts
- Exports: helloWorldPDF
- Dependencies: npm:jspdf


### industries.ts
- Path: /types/industries.ts
- Exports: INDUSTRIES
- Dependencies: 


### routes.ts
- Path: /types/routes.ts
- Exports: 
- Dependencies: 


### env.d.ts
- Path: /types/env.d.ts
- Exports: 
- Dependencies: 


### chat.ts
- Path: /types/chat.ts
- Exports: 
- Dependencies: 


### dashboard.ts
- Path: /types/dashboard.ts
- Exports: 
- Dependencies: ../agents/types/agent.ts


### templates.ts
- Path: /types/templates.ts
- Exports: INDUSTRY_TEMPLATES
- Dependencies: ./types.ts


### types.ts
- Path: /types/types.ts
- Exports: 
- Dependencies: 


### message.ts
- Path: /types/message.ts
- Exports: 
- Dependencies: 


### order.ts
- Path: /types/order.ts
- Exports: 
- Dependencies: 


### index.ts
- Path: /types/index.ts
- Exports: 
- Dependencies: 


### preact.d.ts
- Path: /types/preact.d.ts
- Exports: 
- Dependencies: 


### verify.ts
- Path: /core/metrics/verify.ts
- Exports: 
- Dependencies: ../database/client.ts


### model-metrics.ts
- Path: /core/metrics/model-metrics.ts
- Exports: ModelMetricsCollector
- Dependencies: 


### monitor-registry.ts
- Path: /core/metrics/monitor-registry.ts
- Exports: MonitorRegistry
- Dependencies: ../storage/kv-manager.ts


### types.ts
- Path: /core/metrics/types.ts
- Exports: 
- Dependencies: 


### collector.ts
- Path: /core/metrics/collector.ts
- Exports: MetricsCollector
- Dependencies: ./types.ts, ../database/client.ts


### enhanced-transpile-metrics.ts
- Path: /core/metrics/enhanced-transpile-metrics.ts
- Exports: EnhancedTranspileMetrics
- Dependencies: ../storage/kv-manager.ts


### performance-monitor.ts
- Path: /core/metrics/performance-monitor.ts
- Exports: PerformanceMonitor
- Dependencies: ../database/supabase/client.ts


### index.ts
- Path: /core/metrics/index.ts
- Exports: metricsState
- Dependencies: @preact/signals


### metrics.ts
- Path: /core/metrics/metrics.ts
- Exports: metricsState, formatResponseTime, calculateSuccessRate, aggregateMetrics
- Dependencies: @preact/signals, ./types.ts


### mock-metrics.ts
- Path: /core/metrics/mock-metrics.ts
- Exports: generateMockMetrics
- Dependencies: ./types.ts


### metrics-manager.ts
- Path: /core/metrics/metrics-manager.ts
- Exports: MetricsManager
- Dependencies: ../database/client.ts, ../types.ts


### pipeline.ts
- Path: /core/transpiler/pipeline.ts
- Exports: TranspilationPipeline
- Dependencies: https://deno.land/x/swc@0.2.1/mod.ts, https://deno.land/x/swc@0.2.1/mod.ts


### registry.ts
- Path: /core/tools/registry.ts
- Exports: AgentToolRegistry
- Dependencies: 


### agent-analytics.ts
- Path: /core/types/agent-analytics.ts
- Exports: 
- Dependencies: 


### dashboard.ts
- Path: /core/types/dashboard.ts
- Exports: 
- Dependencies: 


### index.ts
- Path: /core/types/index.ts
- Exports: 
- Dependencies: 


### models.ts
- Path: /core/types/models.ts
- Exports: 
- Dependencies: 


### home.ts
- Path: /core/types/home.ts
- Exports: 
- Dependencies: 


### responses.ts
- Path: /core/types/responses.ts
- Exports: 
- Dependencies: 


### metrics.ts
- Path: /core/types/metrics.ts
- Exports: 
- Dependencies: 


### init.ts
- Path: /core/init.ts
- Exports: 
- Dependencies: 


### manager.ts
- Path: /core/memory/manager.ts
- Exports: MemoryManager
- Dependencies: 


### stream.ts
- Path: /core/memory/stream.ts
- Exports: StreamOptimizer
- Dependencies: 


### agent-validator.ts
- Path: /core/config/agent-validator.ts
- Exports: validateAgentConfig
- Dependencies: ../../agents/types/agent.ts


### base.ts
- Path: /core/providers/base.ts
- Exports: BaseModelClient
- Dependencies: 


### client.ts
- Path: /core/providers/together/client.ts
- Exports: TogetherAIClient
- Dependencies: ../base/client.ts, ../base/model.ts


### client.ts
- Path: /core/providers/anthropic/client.ts
- Exports: AnthropicClient
- Dependencies: ../base.ts


### errir-handler.ts
- Path: /core/providers/base/errir-handler.ts
- Exports: ModelErrorHandler
- Dependencies: 


### model.ts
- Path: /core/providers/base/model.ts
- Exports: 
- Dependencies: 


### client.ts
- Path: /core/providers/base/client.ts
- Exports: ModelClientError
- Dependencies: ./model.ts


### client.ts
- Path: /core/providers/openai/client.ts
- Exports: OpenAIClient
- Dependencies: 


### event-loop.ts
- Path: /core/async/event-loop.ts
- Exports: eventLoop
- Dependencies: events


### advanced-runtime.ts
- Path: /core/async/advanced-runtime.ts
- Exports: advancedRuntime
- Dependencies: events, ./runtime.ts


### runtime.ts
- Path: /core/async/runtime.ts
- Exports: runtime
- Dependencies: https://deno.land/x/event@2.0.1/mod.ts


### module.ts
- Path: /core/runtime/cache/module.ts
- Exports: ModuleCache
- Dependencies: 


### engine.ts
- Path: /core/runtime/engine.ts
- Exports: Runtime
- Dependencies: ./config.ts


### base.ts
- Path: /core/runtime/isolates/base.ts
- Exports: V8Isolate
- Dependencies: 


### v8.ts
- Path: /core/runtime/optimizers/v8.ts
- Exports: V8Optimizer
- Dependencies: 


### model.ts
- Path: /core/runtime/optimizers/model.ts
- Exports: ModelOptimizer
- Dependencies: 


### index.ts
- Path: /core/state/index.ts
- Exports: isLoading, error, activeTab, showCreateForm, selectedAgent, metrics, selectedAgentId, timeRange, currentMetrics, resetUIState, resetNavigationState, resetDataState, resetAllState
- Dependencies: @preact/signals, ../../types/metrics.ts


### types.ts
- Path: /core/types.ts
- Exports: 
- Dependencies: 


### base.ts
- Path: /core/http/handlers/base.ts
- Exports: messageSchema, chatRequestSchema, APIHandlers, routes
- Dependencies: https://deno.land/x/oak/mod.ts, ../workers/worker-pool.ts, ../workers/chat-agent-worker.ts, https://deno.land/x/zod/mod.ts


### fresh.gen.ts
- Path: /core/http/router/fresh.gen.ts
- Exports: 
- Dependencies: ./routes/_app.tsx, $fresh/server.ts


### main.ts
- Path: /core/http/router/main.ts
- Exports: APIRouter
- Dependencies: https://deno.land/x/oak/mod.ts, ../middleware/validation.ts, ../middleware/rate-limit.ts, ../middleware/auth.ts, ../middleware/error.ts, ../middleware/logger.ts


### _app.tsx
- Path: /core/http/router/routes/_app.tsx
- Exports: App
- Dependencies: $fresh/server.ts


### agent-network.ts
- Path: /core/ai/agent-network.ts
- Exports: AgentNetwork, agentNetwork
- Dependencies: ../../agents/types/agent.ts


### config-generator.ts
- Path: /core/deployment/config-generator.ts
- Exports: DeploymentConfigGenerator
- Dependencies: ../../agents/types/agent.ts, ../storage/manager.ts


### base.ts
- Path: /core/workers/tasks/base.ts
- Exports: TaskWorker
- Dependencies: ./error-handler.ts


### legistration-scraper.ts
- Path: /core/workers/tasks/legistration-scraper.ts
- Exports: LegislationScraper
- Dependencies: https://deno.land/x/deno_dom/deno-dom-wasm.ts, ../pool/manager.ts


### handler.ts
- Path: /core/workers/errors/handler.ts
- Exports: WorkerError, WorkerErrorHandler
- Dependencies: 


### manager.ts
- Path: /core/workers/pool/manager.ts
- Exports: ChatAgentWorker, WorkerPool
- Dependencies: ../../runtime/isolates/agent.ts, ../../memory/manager.ts, ../../monitoring/performance.ts


### config.ts
- Path: /core/config.ts
- Exports: config
- Dependencies: ../utils/env.ts


### performance.ts
- Path: /core/monitoring/performance.ts
- Exports: PerformanceMonitor
- Dependencies: 


### transpiler.ts
- Path: /core/monitoring/transpiler.ts
- Exports: TranspileMetrics
- Dependencies: 


### manager.ts
- Path: /core/modules/manager.ts
- Exports: ModuleManager
- Dependencies: 


### upgrader.ts
- Path: /core/modules/upgrader.ts
- Exports: DependencyUpgrader
- Dependencies: ./version, ./registry, ./conflict-resolver


### resolver.ts
- Path: /core/modules/resolver.ts
- Exports: DependencyResolver
- Dependencies: 


### loader.ts
- Path: /core/modules/loader.ts
- Exports: ModuleLoader
- Dependencies: 


### types.ts
- Path: /core/modules/types.ts
- Exports: 
- Dependencies: 


### registry.ts
- Path: /core/modules/registry.ts
- Exports: ModuleRegistry
- Dependencies: 


### version.ts
- Path: /core/modules/version.ts
- Exports: VersionManager, ConflictResolver
- Dependencies: 


### config.ts
- Path: /core/seo/config.ts
- Exports: DEFAULT_TITLE, DEFAULT_DESCRIPTION, BASE_URL, defaultSEOConfig, pageSEOConfig
- Dependencies: 


### agent-analytics.ts
- Path: /core/services/agent-analytics.ts
- Exports: AgentAnalyticsService, agentAnalytics
- Dependencies: ../ai/agent-network.ts, ../types/agent-analytics.ts


### user.service.ts
- Path: /core/services/user.service.ts
- Exports: UserService
- Dependencies: ../database/supabase/client.ts, ../database/schema/types.ts


### manager.ts
- Path: /core/buffer/manager.ts
- Exports: BufferPool, globalBufferPool
- Dependencies: https://cdn.skypack.dev/events@3.3.0


### pool.ts
- Path: /core/buffer/pool.ts
- Exports: BufferPool
- Dependencies: 


### optimizer.ts
- Path: /core/buffer/optimizer.ts
- Exports: BufferOptimizer, globalBufferOptimizer
- Dependencies: 


### zero-copy.ts
- Path: /core/buffer/zero-copy.ts
- Exports: ZeroCopyBuffer, BufferManager, V8BufferOptimizer
- Dependencies: 


### fresh.gen.ts
- Path: /fresh.gen.ts
- Exports: 
- Dependencies: ./routes/_app.tsx, ./routes/_error.tsx, ./routes/_layout.tsx, ./routes/_middleware.ts, ./routes/about.tsx, ./routes/admin/index.tsx, ./routes/api/chat/maia.ts, ./routes/api/dashboard.ts, ./routes/api/index.ts, ./routes/api/profile.ts, ./routes/api/settings.ts, ./routes/api/health.ts, ./routes/api/health/islands.ts, ./routes/api/health/metrics.ts, ./routes/api/metrics/index.ts, ./routes/api/metrics/verify.ts, ./routes/api/metrics/record.ts, ./routes/api/models.ts, ./routes/api/ping.ts, ./routes/contact.tsx, ./routes/dashboard.tsx, ./routes/dashboard/_layout.tsx, ./routes/dashboard/agents/[id].tsx, ./routes/dashboard/agents/deploy/[agentId].tsx, ./routes/dashboard/agents/examples.tsx, ./routes/dashboard/agents/index.tsx, ./routes/dashboard/analytics/index.tsx, ./routes/dashboard/create.tsx, ./routes/dashboard/index.tsx, ./routes/dashboard/metrics/index.tsx, ./routes/dashboard/models/index.tsx, ./routes/dashboard/monitoring/index.tsx, ./routes/dashboard/playground.tsx, ./routes/dashboard/profile.tsx, ./routes/dashboard/settings.tsx, ./routes/index.tsx, ./routes/profile.tsx, ./routes/settings.tsx, ./routes/settings/index.tsx, ./routes/tools.tsx, ./routes/tools/form-filler.tsx, ./routes/tools/monitor.tsx, ./routes/tools/pdf.tsx, ./routes/tools/scraper.tsx, ./routes/tools/screenshot.tsx, ./routes/tools/seo.tsx, ./islands/agents/maia/MaiaWidget.tsx, $fresh/server.ts


### main.ts
- Path: /main.ts
- Exports: 
- Dependencies: $fresh/server.ts, ./fresh.gen.ts, ./fresh.config.ts


### dev.ts
- Path: /dev.ts
- Exports: 
- Dependencies: https://deno.land/std/dotenv/mod.ts, $fresh/server.ts, ./fresh.gen.ts, ./fresh.config.ts


### debug-manifest.ts
- Path: /debug-manifest.ts
- Exports: extractProjectRoot, resolveAdvancedModulePath
- Dependencies: jsr:@std/path, jsr:@std/path/to_file_url, ${path}


### models.ts
- Path: /config/models.ts
- Exports: models
- Dependencies: 


### twind.config.ts
- Path: /twind.config.ts
- Exports: 
- Dependencies: $fresh/plugins/twind.ts


### websocket.mock.ts
- Path: /tests/mocks/websocket.mock.ts
- Exports: 
- Dependencies: 


### transpiler.test.ts
- Path: /tests/transpiler.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.208.0/assert/mod.ts, ../core/transpiler/pipeline.ts


### component-analyzer.test.ts
- Path: /tests/unit/component-analyzer.test.ts
- Exports: TestIsland, TestRoute, MixedComponent, TestComponent
- Dependencies: ../helpers/component-analyzer.ts, $fresh/runtime.ts, preact/hooks, @preact/signals, preact/hooks, $fresh/server.ts, @preact/signals, preact/hooks, $fresh/runtime.ts, $fresh/runtime.ts, @preact/signals, preact/hooks, @preact/signals


### file-trigger.test.ts
- Path: /tests/unit/file-trigger.test.ts
- Exports: NewIsland, NewRoute
- Dependencies: https://deno.land/std@0.208.0/path/mod.ts, ../helpers/component-analyzer.ts, $fresh/runtime.ts, preact/hooks, preact/hooks


### chat_formatting_test.ts
- Path: /tests/chat_formatting_test.ts
- Exports: 
- Dependencies: ../deps.ts, ../utils/chat_formatting.ts


### websockets.test.ts
- Path: /tests/websockets.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.208.0/assert/mod.ts, https://deno.land/std@0.208.0/async/delay.ts


### auth.test.ts
- Path: /tests/auth.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.194.0/testing/asserts.ts


### test_helpers.ts
- Path: /tests/test_helpers.ts
- Exports: createMockWebSocket, createMockResponse, assertMessageSent, assertWebSocketConnected, mockSupabaseClient
- Dependencies: ../deps.ts


### metrics.test.ts
- Path: /tests/metrics.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.208.0/assert/mod.ts, ../core/metrics/performance-monitor.ts


### model_inference_test.ts
- Path: /tests/model_inference_test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.211.0/assert/mod.ts


### component-rendering.test.ts
- Path: /tests/integration/component-rendering.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.170.0/testing/asserts.ts, puppeteer


### test_config.ts
- Path: /tests/test_config.ts
- Exports: TEST_CONFIG
- Dependencies: tincan


### test-helpers.ts
- Path: /tests/wizard/test-helpers.ts
- Exports: TEST_AGENT_DATA, STEP_VALIDATION
- Dependencies: ../../islands/AgentCreation/types.ts


### agent-creation-wizard.test.tsx
- Path: /tests/wizard/agent-creation-wizard.test.tsx
- Exports: 
- Dependencies: std/testing/asserts.ts, @testing-library/preact, ../../islands/AgentCreation/AgentCreationWizard.tsx


### evaluation-step.test.tsx
- Path: /tests/wizard/steps/evaluation-step.test.tsx
- Exports: 
- Dependencies: std/testing/asserts.ts, @testing-library/preact, ../../../islands/AgentCreation/steps/EvaluationStep.tsx, ../test-helpers.ts


### model-step.test.tsx
- Path: /tests/wizard/steps/model-step.test.tsx
- Exports: 
- Dependencies: std/testing/asserts.ts, @testing-library/preact, ../../../islands/AgentCreation/steps/ModelStep.tsx, ../test-helpers.ts


### config-step.test.tsx
- Path: /tests/wizard/steps/config-step.test.tsx
- Exports: 
- Dependencies: std/testing/asserts.ts, @testing-library/preact, ../../../islands/AgentCreation/steps/ConfigStep.tsx, ../test-helpers.ts


### template-step.test.tsx
- Path: /tests/wizard/steps/template-step.test.tsx
- Exports: 
- Dependencies: std/testing/asserts.ts, @testing-library/preact, ../../../islands/AgentCreation/steps/TemplateStep.tsx, ../test-helpers.ts


### use-case-step.test.tsx
- Path: /tests/wizard/steps/use-case-step.test.tsx
- Exports: 
- Dependencies: std/testing/asserts.ts, @testing-library/preact, ../../../islands/AgentCreation/steps/UseCaseStep.tsx, ../test-helpers.ts


### test-step.test.tsx
- Path: /tests/wizard/steps/test-step.test.tsx
- Exports: 
- Dependencies: std/testing/asserts.ts, @testing-library/preact, ../../../islands/AgentCreation/steps/TestStep.tsx, ../test-helpers.ts


### TestSignals.tsx
- Path: /tests/islands/test/TestSignals.tsx
- Exports: TestSignals
- Dependencies: @preact/signals, $fresh/runtime.ts


### TestIsland.tsx
- Path: /tests/islands/test/TestIsland.tsx
- Exports: TestIsland
- Dependencies: @preact/signals, $fresh/runtime.ts


### agent_test.ts
- Path: /tests/agent_test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.211.0/testing/asserts.ts, ../agents/core/base/base_agent.ts, ../agents/types/agent.ts


### filepaths.test.ts
- Path: /tests/filepaths.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.208.0/assert/mod.ts, https://deno.land/std@0.208.0/fs/walk.ts, https://deno.land/std@0.208.0/path/mod.ts


### analytics-dashboard.test.tsx
- Path: /tests/dashboard/analytics-dashboard.test.tsx
- Exports: 
- Dependencies: preact, $std/assert/mod.ts, preact-render-to-string, ../../islands/dashboard/AnalyticsDashboard.tsx


### websocket_test.ts
- Path: /tests/websocket_test.ts
- Exports: 
- Dependencies: ../deps.ts, ../utils/websocket.ts


### agent-config.test.ts
- Path: /tests/agent-config.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.208.0/assert/mod.ts, ../core/config/agent-validator.ts


### agent_config.ts
- Path: /tests/agent_config.ts
- Exports: AGENT_CONFIG, generateTestReport
- Dependencies: deno-opn, https://deno.land/std/testing/asserts.ts


### rendering.test.ts
- Path: /tests/rendering.test.ts
- Exports: 
- Dependencies: ../deps.ts, @preact/signals, preact, preact/hooks, preact-render-to-string, $fresh/runtime.ts


### agent-analytics.test.ts
- Path: /tests/agent-analytics.test.ts
- Exports: 
- Dependencies: $std/assert/mod.ts, ../core/services/agent-analytics.ts, ../core/ai/agent-network.ts


### check-rendering.ts
- Path: /tests/scripts/check-rendering.ts
- Exports: 
- Dependencies: ../helpers/component-analyzer.ts, https://deno.land/std@0.208.0/path/mod.ts


### fix-components.ts
- Path: /tests/scripts/fix-components.ts
- Exports: 
- Dependencies: https://deno.land/std/fs/walk.ts, https://deno.land/std/path/mod.ts, ../helpers/component-analyzer.ts


### test-utils.ts
- Path: /tests/upgrader/test-utils.ts
- Exports: DependencyUpgrader
- Dependencies: ./version, ./registry, ./conflict-resolver


### signal.test.ts
- Path: /tests/signal.test.ts
- Exports: 
- Dependencies: ../deps.ts, @preact/signals


### component-fixes.test.ts
- Path: /tests/component-fixes.test.ts
- Exports: TestIsland, TestRoute
- Dependencies: https://deno.land/std@0.170.0/testing/asserts.ts, ./helpers/component-analyzer.ts, preact/hooks, preact/hooks, $fresh/runtime.ts


### maia_chat_test.ts
- Path: /tests/maia_chat_test.ts
- Exports: 
- Dependencies: ../deps.ts, ../agents/routes/ws.ts


### test-island.tsx
- Path: /tests/routes/test-island.tsx
- Exports: TestIslandPage
- Dependencies: ../islands/test/TestIsland.tsx


### test-signals.tsx
- Path: /tests/routes/test-signals.tsx
- Exports: TestSignalsPage
- Dependencies: ../islands/test/TestSignals.tsx


### test.tsx
- Path: /tests/routes/test.tsx
- Exports: TestPage
- Dependencies: 


### component-analyzer.ts
- Path: /tests/helpers/component-analyzer.ts
- Exports: analyzeComponent
- Dependencies: https://deno.land/std@0.208.0/fs/walk.ts, $fresh/runtime.ts, @preact/signals, @preact/signals


### widget_test.ts
- Path: /tests/widget_test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.211.0/testing/asserts.ts, https://deno.land/std@0.211.0/testing/mock.ts


### api.test.ts
- Path: /tests/api.test.ts
- Exports: 
- Dependencies: ../deps.ts, ./test_helpers.ts


### MetricsPage.tsx
- Path: /islands/MetricsPage.tsx
- Exports: chartInstance, metricsError, MetricsPageIsland
- Dependencies: $fresh/runtime.ts, @preact/signals, ../lib/constants/styles.ts, ../utils/chart.ts, ../core/metrics/types.ts, ../core/metrics/metrics.ts


### AgentMetricsCard.tsx
- Path: /islands/AgentMetricsCard.tsx
- Exports: AgentMetricsCard
- Dependencies: @preact/signals, preact/hooks


### AgentEvaluationTable.tsx
- Path: /islands/AgentEvaluationTable.tsx
- Exports: AgentEvaluationTable
- Dependencies: @preact/signals, preact/hooks


### WebTools.tsx
- Path: /islands/tools/WebTools.tsx
- Exports: WebTools
- Dependencies: preact/hooks, ../agents/maia/MaiaWebTools.tsx


### chat.ts
- Path: /islands/types/chat.ts
- Exports: 
- Dependencies: 


### DashboardTabs.tsx
- Path: /islands/DashboardTabs.tsx
- Exports: DashboardTabs
- Dependencies: $fresh/runtime.ts, ../types/dashboard.ts, ./dashboard/AgentMetricsDashboard.tsx, ./dashboard/AnalyticsDashboard.tsx, ./dashboard/Playground.tsx, ./AgentCreation/AgentCreationWizard.tsx, ./dashboard/Overview.tsx, preact/hooks


### DashboardContent.tsx
- Path: /islands/DashboardContent.tsx
- Exports: DashboardContent
- Dependencies: ../types/dashboard.ts, ./DashboardTabs.tsx


### DeploymentIsland.tsx
- Path: /islands/DeploymentIsland.tsx
- Exports: DeploymentIsland
- Dependencies: preact/hooks, ../agents/types/agent.ts


### RTCMetricsConnection.tsx
- Path: /islands/RTCMetricsConnection.tsx
- Exports: RTCMetricsConnection
- Dependencies: preact/hooks


### Examples.tsx
- Path: /islands/Examples.tsx
- Exports: Examples
- Dependencies: preact/hooks, ./interfaces/MaiaChat.tsx, ./interfaces/PetuniaChat.tsx, ./interfaces/JeffChat.tsx


### AdminDashboard.tsx
- Path: /islands/admin/AdminDashboard.tsx
- Exports: AdminDashboard
- Dependencies: preact/hooks, npm:chart.js@4.4.1/auto


### PetuniaPage.tsx
- Path: /islands/agents/petunia/PetuniaPage.tsx
- Exports: PetuniaPage
- Dependencies: preact/hooks, @preact/signals, ../../../utils/websocket.ts


### PetuniaWidget.tsx
- Path: /islands/agents/petunia/PetuniaWidget.tsx
- Exports: messages, inputValue, isLoading, PetuniaWidget
- Dependencies: @preact/signals, $fresh/runtime.ts, ../../../types/chat.ts


### JeffWidget.tsx
- Path: /islands/agents/jeff/JeffWidget.tsx
- Exports: messages, inputValue, isLoading, JeffWidget
- Dependencies: @preact/signals, $fresh/runtime.ts, ../../../types/chat.ts


### JeffPage.tsx
- Path: /islands/agents/jeff/JeffPage.tsx
- Exports: JeffPage
- Dependencies: preact/hooks, @preact/signals, ../../../utils/websocket.ts, $fresh/runtime.ts


### MaiaWebTools.tsx
- Path: /islands/agents/maia/MaiaWebTools.tsx
- Exports: useMaiaWebTools
- Dependencies: preact/hooks


### MaiaPage.tsx
- Path: /islands/agents/maia/MaiaPage.tsx
- Exports: MaiaPage
- Dependencies: preact


### WebTools.tsx
- Path: /islands/agents/maia/tools/WebTools.tsx
- Exports: WebTools
- Dependencies: preact/hooks, ../MaiaWebTools.tsx


### MaiaWidget.tsx
- Path: /islands/agents/maia/MaiaWidget.tsx
- Exports: messages, inputValue, isLoading, isOpen, MaiaWidget
- Dependencies: @preact/signals, preact, $fresh/runtime.ts, preact/hooks


### Chat.tsx
- Path: /islands/agents/Chat.tsx
- Exports: ChatAgent
- Dependencies: preact/hooks


### ModelsPage.tsx
- Path: /islands/ModelsPage.tsx
- Exports: ModelsPage
- Dependencies: preact, @preact/signals, ../lib/constants/models.ts, ../lib/constants/styles.ts


### AgentPerformanceChart.tsx
- Path: /islands/AgentPerformanceChart.tsx
- Exports: AgentPerformanceChart
- Dependencies: preact/hooks, @preact/signals, ../utils/chart-config.ts


### AgentMetricsDashboard.tsx
- Path: /islands/dashboard/AgentMetricsDashboard.tsx
- Exports: AgentMetricsDashboard
- Dependencies: $fresh/runtime.ts, ../../types/dashboard.ts, ./components/charts/LineChart.tsx, @preact/signals, preact/hooks


### AgentDetails.tsx
- Path: /islands/dashboard/AgentDetails.tsx
- Exports: AgentDetailsIsland
- Dependencies: @preact/signals, ../../types/dashboard.ts, ./MetricsPanel.tsx, ../../components/dashboard/ApiKeyManager.tsx, ../../utils/chart.ts, preact/hooks


### Overview.tsx
- Path: /islands/dashboard/Overview.tsx
- Exports: Overview
- Dependencies: ../../types/dashboard.ts, ../../core/state/index.ts


### DashboardNavigation.tsx
- Path: /islands/dashboard/DashboardNavigation.tsx
- Exports: DashboardNavigation
- Dependencies: @preact/signals, ../../core/state/index.ts, $fresh/runtime.ts


### Playground.tsx
- Path: /islands/dashboard/Playground.tsx
- Exports: PlaygroundIsland
- Dependencies: @preact/signals, preact/hooks, ../../lib/constants/models.ts, ../../types/dashboard.ts, $fresh/runtime.ts


### LineChart.tsx
- Path: /islands/dashboard/components/charts/LineChart.tsx
- Exports: LineChart
- Dependencies: preact/hooks


### AnalyticsDashboard.tsx
- Path: /islands/dashboard/AnalyticsDashboard.tsx
- Exports: AnalyticsDashboard
- Dependencies: preact, preact/hooks, $fresh/runtime.ts, ../../utils/fetch-utils.ts


### MetricsPanel.tsx
- Path: /islands/dashboard/MetricsPanel.tsx
- Exports: MetricsPanel
- Dependencies: preact/hooks, ../../core/types/metrics.ts, ../../lib/constants/styles.ts


### AgentMetricsPanel.tsx
- Path: /islands/components/AgentMetricsPanel.tsx
- Exports: AgentMetricsPanel
- Dependencies: preact/hooks, ../../core/types/metrics.ts, ../../lib/constants/styles.ts


### ChatMessage.tsx
- Path: /islands/components/ChatMessage.tsx
- Exports: ChatMessage
- Dependencies: ../../lib/utils/message-formatter.ts, ../../lib/types/message-formatting.ts


### yamlValidator.ts
- Path: /islands/AgentCreation/utils/yamlValidator.ts
- Exports: validateYaml, formatYaml
- Dependencies: yaml


### api.ts
- Path: /islands/AgentCreation/api.ts
- Exports: 
- Dependencies: ./types.ts


### types.ts
- Path: /islands/AgentCreation/types.ts
- Exports: 
- Dependencies: 


### ReviewAndCreate.tsx
- Path: /islands/AgentCreation/steps/ReviewAndCreate.tsx
- Exports: ReviewAndCreate
- Dependencies: @preact/signals, preact/hooks, ../types.ts, ../utils/yamlValidator.ts


### ModeSelection.tsx
- Path: /islands/AgentCreation/steps/ModeSelection.tsx
- Exports: ModeSelection
- Dependencies: ../types.ts


### TypeSelection.tsx
- Path: /islands/AgentCreation/steps/TypeSelection.tsx
- Exports: TypeSelection
- Dependencies: ../types.ts


### IndustrySelection.tsx
- Path: /islands/AgentCreation/steps/IndustrySelection.tsx
- Exports: IndustrySelection
- Dependencies: ../types.ts


### YamlEditor.tsx
- Path: /islands/AgentCreation/steps/YamlEditor.tsx
- Exports: YamlEditor
- Dependencies: @preact/signals, preact/hooks, ../types.ts, ../utils/yamlValidator.ts, lodash/debounce, prismjs


### ModelSelection.tsx
- Path: /islands/AgentCreation/steps/ModelSelection.tsx
- Exports: ModelSelection
- Dependencies: @preact/signals, preact/hooks, ../types.ts


### AgentWizard.tsx
- Path: /islands/AgentCreation/AgentWizard.tsx
- Exports: AgentWizard
- Dependencies: @preact/signals, preact/hooks, $fresh/runtime.ts, ./types.ts, ./api.ts, ./steps/ModeSelection.tsx, ./steps/IndustrySelection.tsx, ./steps/TypeSelection.tsx, ./steps/YamlEditor.tsx, ./steps/ModelSelection.tsx, ./steps/ReviewAndCreate.tsx


### CreateAgentFlow.tsx
- Path: /islands/CreateAgentFlow.tsx
- Exports: CreateAgentFlow
- Dependencies: @preact/signals, preact/hooks, ./CreateAgentSteps/IndustryStep.tsx, ./CreateAgentSteps/TemplateStep.tsx, ./CreateAgentSteps/ModelConfigStep.tsx, ./CreateAgentSteps/SystemPromptStep.tsx, ./CreateAgentSteps/ToolsStep.tsx, ./CreateAgentSteps/DeploymentStep.tsx


### DeployAgent.tsx
- Path: /islands/DeployAgent.tsx
- Exports: DeployAgent
- Dependencies: preact/hooks, ../agents/types/agent.ts


### LoadingStateIsland.tsx
- Path: /islands/LoadingStateIsland.tsx
- Exports: LoadingStateIsland
- Dependencies: $fresh/runtime.ts, @preact/signals


### FeatureHighlight.tsx
- Path: /islands/FeatureHighlight.tsx
- Exports: FeatureHighlight
- Dependencies: $fresh/runtime.ts, @preact/signals


### AnimatedBackground.tsx
- Path: /islands/AnimatedBackground.tsx
- Exports: AnimatedBackground
- Dependencies: preact, preact/hooks, $fresh/runtime.ts, @preact/signals


### PetuniaChat.tsx
- Path: /islands/interfaces/PetuniaChat.tsx
- Exports: PetuniaChat
- Dependencies: $fresh/runtime.ts, preact/hooks, ../../lib/constants/styles.ts, ../components/ChatMessage.tsx


### MaiaChat.tsx
- Path: /islands/interfaces/MaiaChat.tsx
- Exports: MaiaChat
- Dependencies: preact/hooks, @preact/signals, ../../types/chat.ts, ../../utils/websocket.ts


### JeffChat.tsx
- Path: /islands/interfaces/JeffChat.tsx
- Exports: JeffChat
- Dependencies: preact/hooks, ../../types/chat.ts, ../components/ChatMessage.tsx


### AgentConfig.tsx
- Path: /islands/interfaces/AgentConfig.tsx
- Exports: AgentConfigUI
- Dependencies: @preact/signals, ../../agents/types/agent.ts, ../../core/tools/registry.ts


### MetricsGraph.tsx
- Path: /islands/MetricsGraph.tsx
- Exports: MetricsGraph
- Dependencies: preact/hooks, https://esm.sh/chart.js@4.4.1, ./RTCMetricsConnection.tsx


### agent.ts
- Path: /agents/types/agent.ts
- Exports: 
- Dependencies: 


### registry.ts
- Path: /agents/core/registry.ts
- Exports: REGISTERED_AGENTS
- Dependencies: ../types/agent.ts


### websocket.ts
- Path: /utils/websocket.ts
- Exports: WebSocketClient
- Dependencies: 


### routes.ts
- Path: /utils/routes.ts
- Exports: routes, getRouteTitle, isProtectedRoute
- Dependencies: 


### stripe.ts
- Path: /utils/stripe.ts
- Exports: stripe, SUBSCRIPTION_PRICES, formatAmountForStripe, handleStripeError
- Dependencies: https://esm.sh/stripe@14.10.0?dts


### puppeteer.ts
- Path: /utils/puppeteer.ts
- Exports: PuppeteerTools
- Dependencies: https://deno.land/x/puppeteer@16.2.0/mod.ts, https://deno.land/x/puppeteer@16.2.0/mod.ts


### chart-config.ts
- Path: /utils/chart-config.ts
- Exports: 
- Dependencies: https://esm.sh/chart.js@4.4.1


### permissions.ts
- Path: /utils/permissions.ts
- Exports: PermissionError, PermissionManager
- Dependencies: 


### fetch-utils.ts
- Path: /utils/fetch-utils.ts
- Exports: debounce, fetchWithCache
- Dependencies: 


### agent-response.ts
- Path: /utils/formatters/agent-response.ts
- Exports: AgentResponseFormatter
- Dependencies: 


### debug-head.ts
- Path: /utils/debug-head.ts
- Exports: debugAssetLoading, validateHeadTags
- Dependencies: $fresh/runtime.ts


### chat_formatting.ts
- Path: /utils/chat_formatting.ts
- Exports: formatChatMessage, serializeMessage, parseMessage
- Dependencies: ../deps.ts


### apiKeys.ts
- Path: /utils/apiKeys.ts
- Exports: generateApiKey, isValidApiKey, getKeyPrefix, validateKeyPermissions, isKeyExpired
- Dependencies: https://deno.land/std@0.208.0/encoding/base64.ts


### chart.ts
- Path: /utils/chart.ts
- Exports: 
- Dependencies: https://esm.sh/chart.js@4.4.1


### supabase.ts
- Path: /utils/supabase.ts
- Exports: supabase
- Dependencies: 


### env.ts
- Path: /utils/env.ts
- Exports: env
- Dependencies: zod, https://deno.land/std@0.211.0/dotenv/mod.ts, https://deno.land/std@0.211.0/path/mod.ts


### config.ts
- Path: /utils/config.ts
- Exports: SUPABASE_CONFIG
- Dependencies: 


### load-env.ts
- Path: /utils/load-env.ts
- Exports: 
- Dependencies: https://deno.land/std@0.211.0/dotenv/mod.ts


### db.ts
- Path: /utils/db.ts
- Exports: 
- Dependencies: https://deno.land/x/postgres@v0.17.0/mod.ts


### auth.ts
- Path: /utils/auth.ts
- Exports: isAuthenticated, getUser, requiresAuth, handler
- Dependencies: $fresh/server.ts


### monitored_websocket.ts
- Path: /utils/monitored_websocket.ts
- Exports: metricsCollector, MonitoredWebSocket
- Dependencies: ../deps.ts


### websocket_service.ts
- Path: /utils/websocket_service.ts
- Exports: wsConfig, handleNetworkError, getWsAuthParams, WebSocketService
- Dependencies: ../deps.ts, ./chat_formatting.ts


### chat.ts
- Path: /models/chat.ts
- Exports: ChatService
- Dependencies: ./config.ts, ./factory.ts, ./types.ts


### factory.ts
- Path: /models/factory.ts
- Exports: ModelFactoryError, ModelFactory
- Dependencies: ./config.ts, ./config.ts


### config.ts
- Path: /models/config.ts
- Exports: ConfigurationError, validateConfig
- Dependencies: 


### cleanup.ts
- Path: /cleanup.ts
- Exports: 
- Dependencies: https://deno.land/std/fs/mod.ts, https://deno.land/std/path/mod.ts


### tailwind.config.ts
- Path: /tailwind.config.ts
- Exports: 
- Dependencies: tailwindcss


### CustomButton.tsx
- Path: /components/ui/CustomButton.tsx
- Exports: CustomButton
- Dependencies: @mui/material, ../../lib/constants/styles.ts


### NavBar.tsx
- Path: /components/NavBar.tsx
- Exports: NavBar
- Dependencies: @preact/signals, $fresh/runtime.ts


### RealTimeCollaboration.ts
- Path: /components/collaboration/RealTimeCollaboration.ts
- Exports: RealTimeCollaboration
- Dependencies: events


### CompareModels.tsx
- Path: /components/CompareModels.tsx
- Exports: CompareModels
- Dependencies: preact, preact/hooks


### AgentPermissions.ts
- Path: /components/multi-agent/AgentPermissions.ts
- Exports: PermissionManager, DEFAULT_PERMISSION_CONFIGS
- Dependencies: 


### MultiAgentConfig.tsx
- Path: /components/multi-agent/MultiAgentConfig.tsx
- Exports: MultiAgentConfig
- Dependencies: react, ./AgentOrchestrator, ./AgentPermissions


### TaskRouter.ts
- Path: /components/multi-agent/TaskRouter.ts
- Exports: TaskRouter
- Dependencies: ./AgentOrchestrator


### AgentOrchestrator.ts
- Path: /components/multi-agent/AgentOrchestrator.ts
- Exports: AgentOrchestrator, INTERACTION_PATTERNS, DEFAULT_AGENT_ROLES
- Dependencies: ./AgentPermissions


### SEO.tsx
- Path: /components/SEO.tsx
- Exports: SEO
- Dependencies: preact


### ModelFilter.tsx
- Path: /components/ModelFilter.tsx
- Exports: ModelFilter
- Dependencies: preact, preact/hooks


### MainLayout.tsx
- Path: /components/MainLayout.tsx
- Exports: MainLayout
- Dependencies: preact, preact/hooks, ../islands/interfaces/MaiaWidgetInterface.tsx


### TemplateManager.tsx
- Path: /components/dashboard/TemplateManager.tsx
- Exports: TemplateManager
- Dependencies: preact, preact/hooks, ./IndustryTemplates


### IndustryTemplateSelector.tsx
- Path: /components/dashboard/IndustryTemplateSelector.tsx
- Exports: IndustryTemplateSelector
- Dependencies: preact, preact/hooks, ./IndustryTemplates


### EnhancedAnalytics.tsx
- Path: /components/dashboard/EnhancedAnalytics.tsx
- Exports: EnhancedAnalytics
- Dependencies: preact, preact/hooks, ./IndustryTemplates


### IndustryTemplates.ts
- Path: /components/dashboard/IndustryTemplates.ts
- Exports: TemplateManager, industryTemplates
- Dependencies: 


### ApiKeyManager.tsx
- Path: /components/dashboard/ApiKeyManager.tsx
- Exports: ApiKeyManager
- Dependencies: @preact/signals, ../../types/dashboard.ts, preact/hooks


### ModelPresets.ts
- Path: /components/dashboard/ModelPresets.ts
- Exports: presetStore, generalPresets, industryPresets, modelPresets
- Dependencies: ./types


### ModelTemplate.tsx
- Path: /components/dashboard/ModelTemplate.tsx
- Exports: ModelTemplate
- Dependencies: preact, preact/hooks, ./ModelSelector.tsx, ./ModelPresets.ts, ./ModelValidation.ts, ./ModelPreview.tsx, ./BatchTesting


### TemplateSharing.tsx
- Path: /components/dashboard/TemplateSharing.tsx
- Exports: TemplateSharing
- Dependencies: preact, preact/hooks, ./IndustryTemplates


### TemplateRecommendations.ts
- Path: /components/dashboard/TemplateRecommendations.ts
- Exports: TemplateRecommender
- Dependencies: ./IndustryTemplates


### ModelSelector.tsx
- Path: /components/dashboard/ModelSelector.tsx
- Exports: ModelSelector
- Dependencies: preact, preact/hooks


### BatchTesting.tsx
- Path: /components/dashboard/BatchTesting.tsx
- Exports: BatchTesting
- Dependencies: preact, preact/hooks, ./types


### types.ts
- Path: /components/dashboard/types.ts
- Exports: 
- Dependencies: 


### AgentDashboard.tsx
- Path: /components/dashboard/AgentDashboard.tsx
- Exports: AgentDashboard
- Dependencies: @preact/signals, preact/hooks, ../../utils/chart.ts, ../multi-agent/TaskRouter, ../multi-agent/AgentOrchestrator


### TemplateAnalytics.tsx
- Path: /components/dashboard/TemplateAnalytics.tsx
- Exports: TemplateAnalytics
- Dependencies: preact, preact/hooks


### ModelPreview.tsx
- Path: /components/dashboard/ModelPreview.tsx
- Exports: ModelPreview
- Dependencies: preact, preact/hooks


### TemplateExportImport.ts
- Path: /components/dashboard/TemplateExportImport.ts
- Exports: TemplateExportImport
- Dependencies: ./IndustryTemplates


### ModelValidation.ts
- Path: /components/dashboard/ModelValidation.ts
- Exports: modelLimits, validateModelConfig
- Dependencies: 


### WorkflowBuilder.tsx
- Path: /components/dashboard/WorkflowBuilder.tsx
- Exports: WorkflowBuilder
- Dependencies: react, react-dnd, react-dnd-html5-backend


### EnhancedRLHFDashboard.tsx
- Path: /components/rlhf/EnhancedRLHFDashboard.tsx
- Exports: EnhancedRLHFDashboard
- Dependencies: preact, preact/hooks, ./ABTesting, ./BiasDetector, ./FeedbackCalibrator


### RLHFTrainer.ts
- Path: /components/rlhf/RLHFTrainer.ts
- Exports: RLHFTrainer
- Dependencies: ./FeedbackCollector


### LLMJudge.ts
- Path: /components/rlhf/LLMJudge.ts
- Exports: DEFAULT_JUDGING_CRITERIA, LLMJudge
- Dependencies: ./FeedbackCollector


### BiasDetector.ts
- Path: /components/rlhf/BiasDetector.ts
- Exports: BiasDetector
- Dependencies: ./LLMJudge, ./FeedbackCollector


### ABTesting.ts
- Path: /components/rlhf/ABTesting.ts
- Exports: ABTestingSystem
- Dependencies: ./FeedbackCollector, ./LLMJudge


### FeedbackCalibrator.ts
- Path: /components/rlhf/FeedbackCalibrator.ts
- Exports: FeedbackCalibrator
- Dependencies: ./FeedbackCollector, ./LLMJudge, ./BiasDetector


### FeedbackCollector.ts
- Path: /components/rlhf/FeedbackCollector.ts
- Exports: FeedbackCollector
- Dependencies: uuid


### RLHFDashboard.tsx
- Path: /components/rlhf/RLHFDashboard.tsx
- Exports: RLHFDashboard
- Dependencies: preact, preact/hooks, ./FeedbackCollector, ./RLHFTrainer


### AutomatedRLHFDashboard.tsx
- Path: /components/rlhf/AutomatedRLHFDashboard.tsx
- Exports: AutomatedRLHFDashboard
- Dependencies: preact, preact/hooks, ./AutomatedRLHF, ./LLMJudge


### AutomatedRLHF.ts
- Path: /components/rlhf/AutomatedRLHF.ts
- Exports: AutomatedRLHF
- Dependencies: ./FeedbackCollector, ./LLMJudge, ./RLHFTrainer


### ModelCard.tsx
- Path: /components/ModelCard.tsx
- Exports: ModelCard
- Dependencies: preact


### AgentCreationFlow.ts
- Path: /components/agent-creation/AgentCreationFlow.ts
- Exports: DEFAULT_USE_CASES
- Dependencies: 


### AgentCreationWizard.tsx
- Path: /components/agent-creation/AgentCreationWizard.tsx
- Exports: AgentCreationWizard
- Dependencies: preact, preact/hooks, ../rlhf/ABTesting, ../rlhf/BiasDetector, ../rlhf/FeedbackCalibrator


### Download.tsx
- Path: /components/icons/Download.tsx
- Exports: IconDownload
- Dependencies: 


### Refresh.tsx
- Path: /components/icons/Refresh.tsx
- Exports: IconRefresh
- Dependencies: 


### AgentTemplates.ts
- Path: /components/templates/AgentTemplates.ts
- Exports: AGENT_TEMPLATES
- Dependencies: 


### GolfMemberEngagement.ts
- Path: /components/templates/GolfMemberEngagement.ts
- Exports: MEMBER_ENGAGEMENT_TEMPLATE, ONBOARDING_STEPS, ENGAGEMENT_PROGRAMS, MEMBER_TOUCHPOINTS, ENGAGEMENT_METRICS
- Dependencies: ./AgentTemplates


### TemplateAnalytics.ts
- Path: /components/templates/TemplateAnalytics.ts
- Exports: TemplateAnalytics
- Dependencies: ./AgentTemplates, ./MembershipTemplates


### GolfFacilitiesManagement.ts
- Path: /components/templates/GolfFacilitiesManagement.ts
- Exports: FACILITIES_TEMPLATE, MAINTENANCE_SCHEDULES, FACILITY_AREAS, SUSTAINABILITY_INITIATIVES, FACILITY_METRICS
- Dependencies: ./AgentTemplates


### GolfClubTemplates.ts
- Path: /components/templates/GolfClubTemplates.ts
- Exports: GOLF_TEMPLATES, GOLF_CUSTOMIZATION_OPTIONS
- Dependencies: ./AgentTemplates


### MembershipTemplates.ts
- Path: /components/templates/MembershipTemplates.ts
- Exports: MEMBERSHIP_TEMPLATES, TEMPLATE_CATEGORIES, CUSTOMIZATION_OPTIONS
- Dependencies: ./AgentTemplates


### ServicesList.tsx
- Path: /components/ServicesList.tsx
- Exports: ServicesList
- Dependencies: preact


### SideBar.tsx
- Path: /components/SideBar.tsx
- Exports: SideBar
- Dependencies: @preact/signals


### Button.tsx
- Path: /components/Button.tsx
- Exports: Button
- Dependencies: preact, $fresh/runtime.ts


### ChatMessage.tsx
- Path: /components/ChatMessage.tsx
- Exports: ChatMessage
- Dependencies: preact


### SEOHandler.tsx
- Path: /components/SEOHandler.tsx
- Exports: SEOHandler
- Dependencies: preact, ./SEO.tsx, ../core/seo/config.ts


### PerformanceAnalytics.ts
- Path: /components/analytics/PerformanceAnalytics.ts
- Exports: PerformanceAnalytics
- Dependencies: ../multi-agent/TaskRouter, ../multi-agent/AgentOrchestrator


### AgentDebugger.ts
- Path: /components/debug/AgentDebugger.ts
- Exports: AgentDebugger
- Dependencies: ../multi-agent/TaskRouter, ../multi-agent/AgentOrchestrator


### setup.d.ts
- Path: /sdk/ultravox-client/dist/tests/setup.d.ts
- Exports: 
- Dependencies: 


### UltravoxSession.test.d.ts
- Path: /sdk/ultravox-client/dist/tests/UltravoxSession.test.d.ts
- Exports: 
- Dependencies: 


### UltravoxSession.integration.test.d.ts
- Path: /sdk/ultravox-client/dist/tests/integration/UltravoxSession.integration.test.d.ts
- Exports: 
- Dependencies: 


### types.d.ts
- Path: /sdk/ultravox-client/dist/src/types.d.ts
- Exports: 
- Dependencies: 


### UltravoxSession.d.ts
- Path: /sdk/ultravox-client/dist/src/UltravoxSession.d.ts
- Exports: 
- Dependencies: events


### MaiaAgent.test.ts
- Path: /sdk/ultravox-client/tests/MaiaAgent.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.210.0/testing/asserts.ts, ../src/UltravoxSession.ts, ../src/agents/maia.ts


### UltravoxSession.test.ts
- Path: /sdk/ultravox-client/tests/UltravoxSession.test.ts
- Exports: 
- Dependencies: https://deno.land/std@0.210.0/testing/asserts.ts, node:events, ../src/UltravoxSession.ts


### UltravoxSession.integration.test.ts
- Path: /sdk/ultravox-client/tests/integration/UltravoxSession.integration.test.ts
- Exports: 
- Dependencies: ../../src/UltravoxSession.ts, ../../src/types.ts


### setup.ts
- Path: /sdk/ultravox-client/tests/setup.ts
- Exports: 
- Dependencies: events


### webTools.ts
- Path: /sdk/ultravox-client/src/tools/webTools.ts
- Exports: webTools
- Dependencies: ../types.ts


### maia.ts
- Path: /sdk/ultravox-client/src/agents/maia.ts
- Exports: maiaBaseConfig, createMaiaStageConfig
- Dependencies: ../types.ts, ../tools/webTools.ts


### types.ts
- Path: /sdk/ultravox-client/src/types.ts
- Exports: 
- Dependencies: 


### UltravoxSession.ts
- Path: /sdk/ultravox-client/src/UltravoxSession.ts
- Exports: UltravoxSession
- Dependencies: node:events


### useAnalytics.ts
- Path: /hooks/useAnalytics.ts
- Exports: useAnalytics
- Dependencies: preact/hooks, ../utils/fetch-utils.ts


### update-imports.ts
- Path: /update-imports.ts
- Exports: 
- Dependencies: https://deno.land/std/fs/mod.ts


### component-map.ts
- Path: /component-map.ts
- Exports: componentPaths
- Dependencies: 


### subhosting.ts
- Path: /scripts/subhosting.ts
- Exports: 
- Dependencies: https://deno.land/std/dotenv/mod.ts


### websocket_manager.ts
- Path: /scripts/websocket_manager.ts
- Exports: 
- Dependencies: ./websocket_manager.ts


### update-architecture.ts
- Path: /scripts/update-architecture.ts
- Exports: 
- Dependencies: https://deno.land/std/fs/walk.ts, https://deno.land/std/path/mod.ts


### test_together_simple.ts
- Path: /scripts/test_together_simple.ts
- Exports: 
- Dependencies: 


### diagnose-server.ts
- Path: /scripts/diagnose-server.ts
- Exports: 
- Dependencies: ../utils/puppeteer.ts


### reorganize.ts
- Path: /scripts/reorganize.ts
- Exports: 
- Dependencies: https://deno.land/std/fs/mod.ts


### check-server-status.ts
- Path: /scripts/check-server-status.ts
- Exports: 
- Dependencies: 


### debug-server.ts
- Path: /scripts/debug-server.ts
- Exports: 
- Dependencies: 


### test_together.ts
- Path: /scripts/test_together.ts
- Exports: 
- Dependencies: ../utils/env.ts


### cleanup.ts
- Path: /scripts/cleanup.ts
- Exports: createChatHandler, createWSHandler, ChatLayout
- Dependencies: https://deno.land/std/fs/mod.ts, ../types/agent.ts, ../core/base/base_agent.ts, ../types/agent.ts, ../core/communication/websocket.ts, preact


### check_duplicates.ts
- Path: /scripts/check_duplicates.ts
- Exports: 
- Dependencies: https://deno.land/std/fs/mod.ts, https://deno.land/std/path/mod.ts


### check-server.ts
- Path: /scripts/check-server.ts
- Exports: 
- Dependencies: ../utils/puppeteer.ts


### verify_imports.ts
- Path: /scripts/verify_imports.ts
- Exports: 
- Dependencies: https://deno.land/std/fs/mod.ts


### update-islands.ts
- Path: /scripts/update-islands.ts
- Exports: 
- Dependencies: 


### debug-500.ts
- Path: /scripts/debug-500.ts
- Exports: 
- Dependencies: https://deno.land/x/puppeteer@16.2.0/mod.ts


### update-tsx.ts
- Path: /scripts/update-tsx.ts
- Exports: 
- Dependencies: 


### check_agents.ts
- Path: /scripts/check_agents.ts
- Exports: 
- Dependencies: ../utils/db.ts


### test_together_chat.ts
- Path: /scripts/test_together_chat.ts
- Exports: 
- Dependencies: 


### message-formatting.ts
- Path: /lib/types/message-formatting.ts
- Exports: 
- Dependencies: 


### cohere.ts
- Path: /lib/config/cohere.ts
- Exports: COHERE_API_KEY, COHERE_API_URL
- Dependencies: 


### together.ts
- Path: /lib/config/together.ts
- Exports: TOGETHER_API_KEY, TOGETHER_API_URL
- Dependencies: 


### anthropic.ts
- Path: /lib/config/anthropic.ts
- Exports: ANTHROPIC_API_KEY, ANTHROPIC_API_URL
- Dependencies: 


### openai.ts
- Path: /lib/config/openai.ts
- Exports: OPENAI_API_KEY, OPENAI_API_URL
- Dependencies: 


### mistral.ts
- Path: /lib/config/mistral.ts
- Exports: MISTRAL_API_KEY, MISTRAL_API_URL
- Dependencies: 


### styles.ts
- Path: /lib/constants/styles.ts
- Exports: COLORS, SHADOWS, TRANSITIONS, SPACING, LAYOUT, TYPOGRAPHY, BREAKPOINTS, COMPONENTS
- Dependencies: 


### tools.ts
- Path: /lib/constants/tools.ts
- Exports: TOOL_TYPE_LABELS, AVAILABLE_TOOLS
- Dependencies: ../../agents/types/agent.ts


### models.ts
- Path: /lib/constants/models.ts
- Exports: AVAILABLE_MODELS
- Dependencies: 


### utils.ts
- Path: /lib/utils.ts
- Exports: cn
- Dependencies: clsx, tailwind-merge


### message-formatter.ts
- Path: /lib/utils/message-formatter.ts
- Exports: MessageFormatter
- Dependencies: ../constants/styles.ts, ../types/message-formatting.ts


### clientTools.ts
- Path: /lib/clientTools.ts
- Exports: updateOrderTool
- Dependencies: @/sdk/ultravox-client


### init.ts
- Path: /db/init.ts
- Exports: 
- Dependencies: ../utils/db.ts


### deps.ts
- Path: /deps.ts
- Exports: 
- Dependencies: 


### server.ts
- Path: /server.ts
- Exports: 
- Dependencies: https://deno.land/x/oak@v12.6.1/mod.ts, https://deno.land/x/cors@v1.2.2/mod.ts


### settings.tsx
- Path: /routes/settings.tsx
- Exports: SettingsPage
- Dependencies: @preact/signals


### index.tsx
- Path: /routes/index.tsx
- Exports: handler, Home
- Dependencies: $fresh/server.ts, ../islands/AnimatedBackground.tsx, ../islands/FeatureHighlight.tsx, ../core/types/index.ts, ../components/SEOHandler.tsx, ../core/seo/config.ts, ../islands/agents/maia/MaiaWidget.tsx


### index.tsx
- Path: /routes/settings/index.tsx
- Exports: SettingsPage
- Dependencies: $fresh/server.ts, @preact/signals, ../../types/dashboard.ts, ../../agents/core/registry.ts


### screenshot.tsx
- Path: /routes/tools/screenshot.tsx
- Exports: handler, ScreenshotPage
- Dependencies: $fresh/server.ts, ../../utils/puppeteer.ts, ../../islands/tools/WebTools.tsx


### seo.tsx
- Path: /routes/tools/seo.tsx
- Exports: handler, SEOPage
- Dependencies: $fresh/server.ts, ../../utils/puppeteer.ts


### form-filler.tsx
- Path: /routes/tools/form-filler.tsx
- Exports: handler, FormFillerPage
- Dependencies: $fresh/server.ts, ../../utils/puppeteer.ts


### monitor.tsx
- Path: /routes/tools/monitor.tsx
- Exports: handler, MonitorPage
- Dependencies: $fresh/server.ts, ../../utils/puppeteer.ts


### scraper.tsx
- Path: /routes/tools/scraper.tsx
- Exports: handler, ScraperPage
- Dependencies: $fresh/server.ts, ../../utils/puppeteer.ts


### pdf.tsx
- Path: /routes/tools/pdf.tsx
- Exports: handler, PDFPage
- Dependencies: $fresh/server.ts, ../../utils/puppeteer.ts


### dashboard.tsx
- Path: /routes/dashboard.tsx
- Exports: handler, Dashboard
- Dependencies: $fresh/server.ts, ../core/seo/config.ts, ../components/SEO.tsx, @preact/signals, preact/hooks


### _error.tsx
- Path: /routes/_error.tsx
- Exports: Error500Page
- Dependencies: $fresh/server.ts


### contact.tsx
- Path: /routes/contact.tsx
- Exports: ContactPage
- Dependencies: $fresh/server.ts


### tools.tsx
- Path: /routes/tools.tsx
- Exports: ToolsPage
- Dependencies: $fresh/server.ts


### index.tsx
- Path: /routes/admin/index.tsx
- Exports: AdminPage
- Dependencies: $fresh/server.ts, $fresh/runtime.ts, ../../islands/admin/AdminDashboard.tsx


### _middleware.ts
- Path: /routes/_middleware.ts
- Exports: 
- Dependencies: $fresh/server.ts


### settings.tsx
- Path: /routes/dashboard/settings.tsx
- Exports: handler, Settings
- Dependencies: $fresh/server.ts


### index.tsx
- Path: /routes/dashboard/index.tsx
- Exports: handler, Dashboard, config
- Dependencies: $fresh/server.ts, ../../islands/DashboardTabs.tsx


### index.tsx
- Path: /routes/dashboard/metrics/index.tsx
- Exports: handler, Metrics
- Dependencies: $fresh/server.ts, preact, @preact/signals, ../../../islands/MetricsPage.tsx, ../../../core/types/index.ts, ../../../components/SEO.tsx, ../_layout.tsx


### create.tsx
- Path: /routes/dashboard/create.tsx
- Exports: CreateAgentPage
- Dependencies: $fresh/server.ts, ../../components/SEO.tsx


### index.tsx
- Path: /routes/dashboard/agents/index.tsx
- Exports: AgentsPage
- Dependencies: $fresh/server.ts, ../../../islands/agents/maia/MaiaWidget.tsx, ../../../islands/AgentCreation/AgentCreationWizard.tsx


### [agentId].tsx
- Path: /routes/dashboard/agents/deploy/[agentId].tsx
- Exports: handler, DeployPage
- Dependencies: $fresh/server.ts, ../../../../islands/DeployAgent.tsx, ../../../../agents/types/agent.ts, ../../../../agents/core/registry.ts, ../../../../components/SEO.tsx


### examples.tsx
- Path: /routes/dashboard/agents/examples.tsx
- Exports: ExamplesPage
- Dependencies: $fresh/server.ts, ../../../islands/Examples.tsx


### [id].tsx
- Path: /routes/dashboard/agents/[id].tsx
- Exports: handler, AgentDetailsPage
- Dependencies: $fresh/server.ts, ../../../islands/dashboard/AgentDetails.tsx, ../../../types/dashboard.ts, ../../../components/SEO.tsx, ../../../core/seo/config.ts


### index.tsx
- Path: /routes/dashboard/models/index.tsx
- Exports: handler, ModelsPageRoute
- Dependencies: $fresh/server.ts, preact, ../../../islands/ModelsPage.tsx, ../../../lib/constants/models.ts


### playground.tsx
- Path: /routes/dashboard/playground.tsx
- Exports: handler, PlaygroundPage, config
- Dependencies: @preact/signals, $fresh/server.ts, ../../utils/auth.ts, ./_layout.tsx


### _islands.tsx
- Path: /routes/dashboard/_islands.tsx
- Exports: Islands
- Dependencies: $fresh/runtime.ts, ../../islands/AgentCreation/AgentCreationWizard.tsx


### profile.tsx
- Path: /routes/dashboard/profile.tsx
- Exports: handler, Profile, config
- Dependencies: $fresh/server.ts, @preact/signals, ../../utils/db.ts


### _layout.tsx
- Path: /routes/dashboard/_layout.tsx
- Exports: DashboardLayout, config
- Dependencies: $fresh/server.ts, ../../components/NavBar.tsx, ../../components/SideBar.tsx


### index.tsx
- Path: /routes/dashboard/monitoring/index.tsx
- Exports: MonitoringPage
- Dependencies: $fresh/server.ts, ../../../islands/dashboard/AgentMetricsDashboard.tsx, ../../../agents/core/registry.ts, ../_layout.tsx


### index.tsx
- Path: /routes/dashboard/analytics/index.tsx
- Exports: handler, Analytics
- Dependencies: $fresh/server.ts, preact, ../../../islands/dashboard/AnalyticsDashboard.tsx, ../_layout.tsx, ../../../components/SEO.tsx


### test.ts
- Path: /routes/test.ts
- Exports: 
- Dependencies: $fresh/server.ts


### profile.tsx
- Path: /routes/profile.tsx
- Exports: ProfilePage
- Dependencies: @preact/signals, $fresh/runtime.ts


### _layout.tsx
- Path: /routes/_layout.tsx
- Exports: Layout, config
- Dependencies: $fresh/server.ts, ../components/NavBar.tsx


### verify.ts
- Path: /routes/api/metrics/verify.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### record.ts
- Path: /routes/api/metrics/record.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### index.ts
- Path: /routes/api/metrics/index.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### ping.ts
- Path: /routes/api/ping.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### maia.ts
- Path: /routes/api/chat/maia.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../core/providers/anthropic/client.ts, https://deno.land/std@0.208.0/yaml/mod.ts


### jeff.ts
- Path: /routes/api/chat/jeff.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../core/providers/anthropic/client.ts, https://deno.land/std@0.208.0/yaml/mod.ts


### petunia.ts
- Path: /routes/api/chat/petunia.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../core/providers/anthropic/client.ts, https://deno.land/std@0.208.0/yaml/mod.ts


### settings.ts
- Path: /routes/api/settings.ts
- Exports: handler
- Dependencies: $fresh/server.ts, https://deno.land/std@0.194.0/http/cookie.ts


### islands.ts
- Path: /routes/api/health/islands.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### metrics.ts
- Path: /routes/api/health/metrics.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### agents.ts
- Path: /routes/api/admin/agents.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../core/database/supabase/client.ts


### users.ts
- Path: /routes/api/admin/users.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../core/database/supabase/client.ts


### system.ts
- Path: /routes/api/admin/system.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../core/database/supabase/client.ts


### metrics.ts
- Path: /routes/api/admin/metrics.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../core/database/supabase/client.ts


### save.ts
- Path: /routes/api/agents/steps/save.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../../islands/AgentCreation/types.ts


### initialize.ts
- Path: /routes/api/agents/initialize.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../islands/AgentCreation/types.ts


### complete.ts
- Path: /routes/api/agents/[id]/steps/[stepId]/complete.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### update.ts
- Path: /routes/api/agents/[id]/update.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../../../islands/AgentCreation/types.ts


### dashboard.ts
- Path: /routes/api/dashboard.ts
- Exports: handler
- Dependencies: $fresh/server.ts, https://deno.land/std@0.194.0/http/cookie.ts


### agents.ts
- Path: /routes/api/agents.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../core/database/supabase/client.ts


### test.ts
- Path: /routes/api/test.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### agent-metrics.ts
- Path: /routes/api/agent-metrics.ts
- Exports: handler
- Dependencies: $fresh/server.ts, ../../core/database/supabase/client.ts


### profile.ts
- Path: /routes/api/profile.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### health.ts
- Path: /routes/api/health.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### index.ts
- Path: /routes/api/index.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### models.ts
- Path: /routes/api/models.ts
- Exports: handler
- Dependencies: $fresh/server.ts


### _app.tsx
- Path: /routes/_app.tsx
- Exports: App
- Dependencies: $fresh/server.ts


### chat.ts
- Path: /routes/ws/agents/chat.ts
- Exports: 
- Dependencies: $fresh/server.ts


### about.tsx
- Path: /routes/about.tsx
- Exports: AboutPage
- Dependencies: $fresh/server.ts


### hello.ts
- Path: /routes/hello.ts
- Exports: 
- Dependencies: $fresh/server.ts


### build.ts
- Path: /build.ts
- Exports: config
- Dependencies: $fresh/plugins/twind.ts


## Database Schema
```sql
-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS metrics CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create agents table
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    model VARCHAR(50) NOT NULL,
    system_prompt TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create requests table
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(id),
    user_id INTEGER REFERENCES users(id),
    prompt TEXT NOT NULL,
    response TEXT,
    tokens_used INTEGER,
    duration_ms INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create metrics table
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(id),
    total_requests INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    average_latency INTEGER DEFAULT 0,
    success_rate DECIMAL DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_log table
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    agent_id INTEGER REFERENCES agents(id),
    action_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_agents_created_by ON agents(created_by);
CREATE INDEX idx_requests_agent_id ON requests(agent_id);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_metrics_agent_id ON metrics(agent_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_agent_id ON activity_log(agent_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_metrics_updated_at ON metrics;
CREATE TRIGGER update_metrics_updated_at
    BEFORE UPDATE ON metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

```
