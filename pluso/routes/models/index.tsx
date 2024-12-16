import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import NavBar from "../../islands/NavBar.tsx";
import ModelsPageIsland from "../../islands/ModelsPageIsland.tsx";
import { COLORS, TYPOGRAPHY } from "../../lib/constants/styles.ts";

export default function ModelsPage(props: PageProps) {
  return (
    <div 
      class="min-h-screen"
      style={{ 
        backgroundColor: COLORS.gray[50],
        fontFamily: TYPOGRAPHY.fontFamily.base 
      }}
    >
      <Head>
        <title>Models - PluSO</title>
      </Head>
      <NavBar />
      <ModelsPageIsland />
    </div>
  );
}