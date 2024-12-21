import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";
import {
  TemplateManager,
  type TemplateAnalytics,
  type TemplateVersion,
} from "./IndustryTemplates";

interface TemplateAnalyticsProps {
  templateId: string;
}

export function TemplateAnalytics({ templateId }: TemplateAnalyticsProps): JSX.Element {
  const [analytics, setAnalytics] = useState<TemplateAnalytics | undefined>();
  const [versions, setVersions] = useState<TemplateVersion[]>([]);
  const [selectedTab, setSelectedTab] = useState<"usage" | "versions">("usage");

  const templateManager = TemplateManager.getInstance();

  useEffect(() => {
    loadData();
  }, [templateId]);

  const loadData = () => {
    setAnalytics(templateManager.getTemplateAnalytics(templateId));
    setVersions(templateManager.getTemplateVersions(templateId));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div class="space-y-6">
      <div class="flex space-x-4 border-b">
        <button
          onClick={() => setSelectedTab("usage")}
          class={`py-2 px-4 ${
            selectedTab === "usage"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Usage Analytics
        </button>
        <button
          onClick={() => setSelectedTab("versions")}
          class={`py-2 px-4 ${
            selectedTab === "versions"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Version History
        </button>
      </div>

      {selectedTab === "usage" && analytics && (
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Total Uses</div>
              <div class="text-2xl font-semibold">{analytics.uses}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Success Rate</div>
              <div class="text-2xl font-semibold">
                {(analytics.successRate * 100).toFixed(1)}%
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Avg. Tokens</div>
              <div class="text-2xl font-semibold">
                {Math.round(analytics.averageTokens)}
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Avg. Cost</div>
              <div class="text-2xl font-semibold">
                ${analytics.averageCost.toFixed(4)}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <h3 class="text-lg font-medium mb-4">Popular Variables</h3>
              <div class="space-y-2">
                {Object.entries(analytics.popularVariables)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([variable, count]) => (
                    <div
                      key={variable}
                      class="flex justify-between items-center"
                    >
                      <span class="text-gray-600">{variable}</span>
                      <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {count} uses
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow-sm">
              <h3 class="text-lg font-medium mb-4">Industry Usage</h3>
              <div class="space-y-2">
                {Object.entries(analytics.industryUsage)
                  .sort(([, a], [, b]) => b - a)
                  .map(([industry, count]) => (
                    <div
                      key={industry}
                      class="flex justify-between items-center"
                    >
                      <span class="text-gray-600">{industry}</span>
                      <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {count} uses
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div class="text-sm text-gray-600">
            Last used: {formatDate(analytics.lastUsed)}
          </div>
        </div>
      )}

      {selectedTab === "versions" && (
        <div class="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              class="bg-white p-4 rounded-lg shadow-sm space-y-2"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium">Version {version.version}</div>
                  <div class="text-sm text-gray-600">
                    {formatDate(version.createdAt)}
                  </div>
                </div>
                {version.createdBy && (
                  <div class="text-sm text-gray-600">
                    By: {version.createdBy}
                  </div>
                )}
              </div>
              <div class="text-sm">{version.changes}</div>
              <div class="mt-2 space-y-2">
                <div class="text-sm font-medium">Changes:</div>
                <div class="text-sm bg-gray-50 p-2 rounded">
                  <pre class="whitespace-pre-wrap">{version.prompt}</pre>
                </div>
                {version.responseTemplate && (
                  <>
                    <div class="text-sm font-medium">Response Template:</div>
                    <div class="text-sm bg-gray-50 p-2 rounded">
                      <pre class="whitespace-pre-wrap">
                        {version.responseTemplate}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
