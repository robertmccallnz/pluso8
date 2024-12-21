import { PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";

export default function AboutPage({ url }: PageProps) {
  return (
    <Layout url={url}>
      {/* Your about page content */}
    </Layout>
  );
}