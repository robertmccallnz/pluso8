import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import PetuniaChat from "../../islands/interfaces/PetuniaChat.tsx";

interface ExpertiseArea {
  title: string;
  description: string;
  icon: string;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const message = form.get("message")?.toString() || "";

    const response = {
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: "Kia ora! I'll help you with that..." }
      ]
    };

    return new Response(JSON.stringify(response));
  }
};

export default function PetuniaPage() {
  const expertiseAreas: ExpertiseArea[] = [
    {
      title: "Native Plants",
      description: "Expert knowledge of New Zealand's indigenous flora",
      icon: "🌿"
    },
    {
      title: "Sustainable Gardening",
      description: "Eco-friendly gardening practices and techniques",
      icon: "🌱"
    },
    {
      title: "Conservation",
      description: "Ecological preservation and native species protection",
      icon: "🍃"
    }
  ];

  return (
    <div class="min-h-screen bg-[#F5F5F5]">
      <Head>
        <title>Petunia - PluSO Nature Guide</title>
        <meta name="description" content="Expert in New Zealand flora and gardening" />
      </Head>

      <main class="max-w-4xl mx-auto pt-24 px-4">
        {/* Header Section */}
        <div class="text-center mb-16">
          <div class="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-[#333333] flex items-center justify-center">
            <span class="text-5xl">🌺</span>
          </div>

          <h1 class="text-6xl font-bold text-[#333333] mb-4">Petunia</h1>
          <div class="space-y-4">
            <p class="text-xl text-[#333333]">
              <span class="font-semibold">Kia ora!</span> Welcome to your personal garden guide
            </p>
            <p class="text-[#333333]/70 max-w-2xl mx-auto">
              Expert in New Zealand native plants, sustainable gardening practices, and ecological conservation. 
              Fluent in both te reo Māori and English.
            </p>
          </div>
        </div>

        {/* Expertise Areas */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {expertiseAreas.map((area) => (
            <div class="bg-[#333333]/10 rounded-lg p-6 text-center">
              <div class="text-4xl mb-4">{area.icon}</div>
              <h3 class="text-xl font-semibold text-[#333333] mb-2">{area.title}</h3>
              <p class="text-[#333333]/70">{area.description}</p>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div class="bg-[#333333]/10 rounded-lg p-6 mb-16">
          <h2 class="text-2xl font-semibold text-[#333333] mb-4">Services</h2>
          <ul class="space-y-2">
            <li class="flex items-center text-[#333333]">
              <span class="mr-2">✓</span>
              Plant identification and care advice
            </li>
            <li class="flex items-center text-[#333333]">
              <span class="mr-2">✓</span>
              Garden planning and maintenance tips
            </li>
            <li class="flex items-center text-[#333333]">
              <span class="mr-2">✓</span>
              Native species conservation guidance
            </li>
            <li class="flex items-center text-[#333333]">
              <span class="mr-2">✓</span>
              Sustainable gardening practices
            </li>
          </ul>
        </div>

        {/* Chat Interface */}
        <div class="max-w-3xl mx-auto mb-16">
          <PetuniaChat 
            endpoint="/petunia"
            agentName="PETUNIA"
            allowFiles={false}
          />
        </div>

        <footer class="text-center text-[#333333]/60 text-sm py-8">
          © {new Date().getFullYear()} PluSO | Expert Garden Guidance
        </footer>
      </main>
    </div>
  );
}
