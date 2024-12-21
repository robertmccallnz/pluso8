import { h } from "https://esm.sh/preact";

export default function SettingsPage() {
  let savedStatus = "";

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        savedStatus = "Settings saved successfully!";
      } else {
        savedStatus = "Failed to save settings.";
      }
    } catch (error) {
      savedStatus = "An error occurred.";
    }
  };

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Settings</h1>

        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Preferences</h2>
            
            <form onSubmit={handleSubmit} class="space-y-6">
              {/* Theme Settings */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Theme</span>
                </label>
                <select class="select select-bordered w-full" name="theme">
                  <option value="lemonade">Lemonade (Default)</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="cupcake">Cupcake</option>
                </select>
              </div>

              {/* Notification Settings */}
              <div class="space-y-4">
                <label class="label">
                  <span class="label-text font-medium">Notifications</span>
                </label>
                
                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" class="toggle toggle-primary" name="emailNotifications" />
                    <span class="label-text">Email Notifications</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" class="toggle toggle-primary" name="pushNotifications" />
                    <span class="label-text">Push Notifications</span>
                  </label>
                </div>
              </div>

              {/* Privacy Settings */}
              <div class="space-y-4">
                <label class="label">
                  <span class="label-text font-medium">Privacy</span>
                </label>
                
                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" class="toggle toggle-primary" name="profileVisible" />
                    <span class="label-text">Make Profile Public</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" class="toggle toggle-primary" name="activityVisible" />
                    <span class="label-text">Show Activity Status</span>
                  </label>
                </div>
              </div>

              {/* Language Settings */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Language</span>
                </label>
                <select class="select select-bordered w-full" name="language">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              {/* Save Button */}
              <div class="pt-4">
                <button type="submit" class="btn btn-primary w-full">
                  Save Settings
                </button>

                {savedStatus && (
                  <div class={`alert ${savedStatus.includes("success") ? "alert-success" : "alert-error"} mt-4`}>
                    <span>{savedStatus}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
