import { Handlers, PageProps } from "$fresh/server.ts";

interface SettingsData {
  settings?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  error?: string;
}

export const handler: Handlers<SettingsData> = {
  async GET(_req, ctx) {
    return ctx.render({
      settings: {
        theme: "dark",
        notifications: true,
        language: "en"
      }
    });
  }
};

export default function Settings({ data }: PageProps<SettingsData>) {
  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Settings</h1>
      
      <div class="bg-base-200 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Preferences</h2>
        
        <div class="space-y-4">
          <div>
            <label class="label">Theme</label>
            <select class="select select-bordered w-full max-w-xs" value={data.settings?.theme}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label class="label cursor-pointer">
              <span class="label-text">Enable Notifications</span>
              <input 
                type="checkbox" 
                class="toggle" 
                checked={data.settings?.notifications}
              />
            </label>
          </div>

          <div>
            <label class="label">Language</label>
            <select class="select select-bordered w-full max-w-xs" value={data.settings?.language}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div class="mt-6">
          <button class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
