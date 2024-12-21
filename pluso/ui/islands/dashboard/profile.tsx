import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import { db } from "../../utils/db.ts";

interface ProfileData {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
  };
}

export const handler: Handlers<ProfileData> = {
  async GET(_req, ctx) {
    try {
      // For now, we'll get the first user since we don't have auth yet
      const user = await db.findOne("users", { email: "admin@example.com" });
      
      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      return ctx.render({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },

  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const name = form.get("name")?.toString();
      const email = form.get("email")?.toString();

      if (!name || !email) {
        return new Response("Name and email are required", { status: 400 });
      }

      // For now, we'll update the first user
      const user = await db.updateOne("users", 1, {
        name,
        email,
        updated_at: new Date().toISOString()
      });

      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard/profile" }
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};

export default function Profile({ data }: PageProps<ProfileData>) {
  const avatarPreview = useSignal<string>(data.user.avatar_url);
  const isEditing = useSignal(false);

  return (
    <main class="max-w-4xl mx-auto">
      <header class="mb-8">
        <h1 class="text-2xl font-bold">Profile Settings</h1>
        <p class="text-gray-600">Manage your account settings and preferences</p>
      </header>

      <section class="bg-white rounded-lg shadow">
        <div class="p-6 space-y-6">
          <div class="flex items-start space-x-6">
            <img
              src={avatarPreview.value}
              alt="Profile"
              class="w-24 h-24 rounded-full"
            />
            <div class="flex-1">
              <h3 class="font-medium">{data.user.name}</h3>
              <p class="text-gray-500">{data.user.email}</p>
              <p class="text-sm text-gray-500">{data.user.role}</p>
              <p class="text-xs text-gray-400">Member since {new Date(data.user.created_at).toLocaleDateString()}</p>
            </div>
            <button 
              onClick={() => isEditing.value = !isEditing.value}
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {isEditing.value ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {isEditing.value && (
            <form method="POST" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={data.user.name}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.user.email}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div class="pt-4">
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export const config = {
  title: "Profile Settings",
};
