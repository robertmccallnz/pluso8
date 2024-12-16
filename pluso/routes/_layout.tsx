import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function Layout({ Component, url }: PageProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pluso - AI Agent Platform</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Component />
    </>
  );
}
