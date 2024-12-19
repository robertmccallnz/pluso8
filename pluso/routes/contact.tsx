import { PageProps } from "$fresh/server.ts";

export default function ContactPage(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p class="text-xl text-gray-600">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div class="bg-white shadow rounded-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <form class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={4}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                ></textarea>
              </div>
              <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div class="bg-white shadow rounded-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Email</h3>
                <p class="mt-2 text-gray-600">support@pluso.ai</p>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">Office</h3>
                <p class="mt-2 text-gray-600">
                  123 AI Street<br />
                  Silicon Valley, CA 94025<br />
                  United States
                </p>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">Social</h3>
                <div class="mt-2 flex space-x-6">
                  <a href="#" class="text-gray-600 hover:text-gray-900">
                    Twitter
                  </a>
                  <a href="#" class="text-gray-600 hover:text-gray-900">
                    LinkedIn
                  </a>
                  <a href="#" class="text-gray-600 hover:text-gray-900">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
