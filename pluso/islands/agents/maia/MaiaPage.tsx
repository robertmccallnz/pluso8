import { h } from "preact";

export default function MaiaPage() {
  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-6">Maia - Your AI Assistant</h1>
      <div class="bg-white rounded-lg shadow-lg p-6">
        <p class="text-lg mb-4">
          Maia is your intelligent AI assistant, designed to help with a wide range of tasks,
          from answering questions to helping with complex problem-solving.
        </p>
        <div class="mt-6">
          <a
            href="/maia/chat"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Chat with Maia
          </a>
        </div>
      </div>
    </div>
  );
}
