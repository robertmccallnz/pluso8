/** @jsxImportSource preact */
import { Head } from "$fresh/runtime.ts";
import { tw } from "twind";
import NavBar from "../../islands/NavBar.tsx";
import { COLORS, TYPOGRAPHY } from "../../lib/constants/styles.ts";
import LegalChat from "../../islands/interfaces/LegalChat.tsx";

export default function JeffLegal() {
  return (
    <>
      <Head>
        <title>Jeff Legal - PluSO</title>
        <meta name="description" content="Legal assistant powered by PluSO" />
      </Head>

      <div class={tw`min-h-screen bg-gradient-to-b from-white to-gray-50`}>
        <NavBar />
        
        <main class={tw`container mx-auto px-4 py-8 mt-20`}>
          <div class={tw`max-w-7xl mx-auto`}>
            <h1 
              class={tw`text-4xl font-bold mb-8`}
              style={{ 
                fontFamily: TYPOGRAPHY.fontFamily.base,
                color: COLORS.brand.blue 
              }}
            >
              jeff_<span style={{ color: COLORS.text.primary }}>LEGAL</span>
            </h1>

            <div class={tw`prose prose-lg max-w-none mb-8`}>
              <p class={tw`text-gray-600`}>
                Your intelligent legal assistant, powered by PluSO technology.
              </p>
            </div>

            <div class={tw`w-full`}>
              <LegalChat />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}