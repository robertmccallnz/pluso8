import { JSX } from "preact";
import { useState } from "preact/hooks";
import { TemplateManager, type TemplateShare } from "./IndustryTemplates";

interface TemplateSharingProps {
  templateId: string;
  onShare: (share: TemplateShare) => void;
}

export function TemplateSharing({ templateId, onShare }: TemplateSharingProps): JSX.Element {
  const [shareType, setShareType] = useState<"public" | "private" | "organization">("private");
  const [accessCode, setAccessCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [usageLimit, setUsageLimit] = useState<number | undefined>();
  const [showForm, setShowForm] = useState(false);

  const templateManager = TemplateManager.getInstance();

  const handleShare = () => {
    const share = templateManager.shareTemplate(templateId, shareType, {
      accessCode: shareType === "private" ? accessCode : undefined,
      expiresAt: expiresAt || undefined,
      usageLimit: usageLimit,
    });

    onShare(share);
    setShowForm(false);
  };

  const generateShareLink = (share: TemplateShare) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/templates/shared/${share.id}${
      share.accessCode ? `?code=${share.accessCode}` : ""
    }`;
  };

  return (
    <div class="space-y-4">
      <button
        onClick={() => setShowForm(true)}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Share Template
      </button>

      {showForm && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 class="text-lg font-medium mb-4">Share Template</h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Share Type
                </label>
                <select
                  value={shareType}
                  onChange={(e) =>
                    setShareType(
                      (e.target as HTMLSelectElement).value as typeof shareType
                    )
                  }
                  class="mt-1 w-full px-3 py-2 border rounded-md"
                >
                  <option value="public">Public (Anyone can access)</option>
                  <option value="private">
                    Private (Access code required)
                  </option>
                  <option value="organization">
                    Organization (Only team members)
                  </option>
                </select>
              </div>

              {shareType === "private" && (
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Access Code
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onInput={(e) =>
                      setAccessCode((e.target as HTMLInputElement).value)
                    }
                    class="mt-1 w-full px-3 py-2 border rounded-md"
                    placeholder="Enter access code"
                    required
                  />
                </div>
              )}

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onInput={(e) =>
                    setExpiresAt((e.target as HTMLInputElement).value)
                  }
                  class="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Usage Limit (Optional)
                </label>
                <input
                  type="number"
                  value={usageLimit}
                  onInput={(e) =>
                    setUsageLimit(
                      parseInt((e.target as HTMLInputElement).value) || undefined
                    )
                  }
                  class="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="No limit"
                  min="1"
                />
              </div>

              <div class="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  class="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={shareType === "private" && !accessCode}
                >
                  Generate Share Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
