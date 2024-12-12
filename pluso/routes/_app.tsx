// routes/_app.tsx
import { type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { tw } from "twind";
import NavBar from "../islands/NavBar.tsx";

export default function App({ Component }: PageProps) {
  return (
    <>
      <Head>
        <title>PluSO - AI Agents Platform</title>
        <meta name="description" content="Next-generation AI agents with cultural intelligence" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Head>

      <div class={tw`min-h-screen flex flex-col bg-yellow-50`}>
        <NavBar />
        <main class={tw`flex-grow relative`}>
          <Component />
        </main>
      </div>
    </>
  );
}