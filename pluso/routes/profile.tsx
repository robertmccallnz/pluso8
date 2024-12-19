import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function ProfilePage() {
  const avatarPreview = useSignal<string | null>(null);
  const uploadStatus = useSignal<string>("");

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          avatarPreview.value = e.target.result as string;
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        uploadStatus.value = "Avatar updated successfully!";
      } else {
        uploadStatus.value = "Failed to update avatar.";
      }
    } catch (error) {
      uploadStatus.value = "Error uploading avatar.";
    }
  };

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Profile Settings</h1>

        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Avatar</h2>
            
            <div class="flex items-center space-x-6 mb-6">
              <div class="avatar">
                <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img 
                    src={avatarPreview.value || "/placeholder-avatar.png"} 
                    alt="Profile Avatar" 
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} class="flex-1">
                <div class="form-control w-full">
                  <input 
                    type="file" 
                    class="file-input file-input-bordered file-input-primary w-full" 
                    accept="image/*"
                    onChange={handleFileChange}
                    name="avatar"
                  />
                  <label class="label">
                    <span class="label-text-alt">Supported formats: PNG, JPG, GIF</span>
                  </label>
                </div>
                
                {uploadStatus.value && (
                  <div class={`alert ${uploadStatus.value.includes("success") ? "alert-success" : "alert-error"} mt-4`}>
                    <span>{uploadStatus.value}</span>
                  </div>
                )}

                <button type="submit" class="btn btn-primary mt-4">
                  Update Avatar
                </button>
              </form>
            </div>

            <div class="divider"></div>

            <h2 class="card-title mb-4">Personal Information</h2>
            <form class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Display Name</span>
                </label>
                <input type="text" class="input input-bordered" />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Email</span>
                </label>
                <input type="email" class="input input-bordered" />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Bio</span>
                </label>
                <textarea class="textarea textarea-bordered h-24"></textarea>
              </div>

              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
