import { PageProps } from "$fresh/server.ts";

export default function AboutPage(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-8">About PluSO</h1>
          <p class="text-xl text-gray-600 mb-12">
            Empowering developers with intelligent AI agents
          </p>
        </div>

        <div class="bg-white shadow rounded-lg p-8 mb-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p class="text-gray-600 mb-6">
            PluSO is dedicated to making AI development accessible, efficient, and powerful. 
            We provide a comprehensive platform for creating, testing, and deploying AI agents 
            that can transform how you build and scale your applications.
          </p>

          <h2 class="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
          <ul class="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Intuitive agent development interface</li>
            <li>Real-time testing and debugging tools</li>
            <li>Comprehensive analytics and monitoring</li>
            <li>Scalable deployment options</li>
            <li>Enterprise-grade security</li>
          </ul>

          <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p class="text-gray-600">
            We're a team of passionate developers, AI researchers, and product designers 
            working together to build the future of AI development. Our diverse backgrounds 
            and expertise enable us to create innovative solutions for complex challenges.
          </p>
        </div>
      </div>
    </div>
  );
}
