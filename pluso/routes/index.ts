/ pluso/routes/index.tsx
import { Head } from "$fresh/runtime.ts";
import ChatAgent from "../islands/ChatAgent.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>PluSO - Chat Agents Platform</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <ChatAgent agentId="maia" />
      </div>
    </>
  );
}