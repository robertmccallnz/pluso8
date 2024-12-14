import { Head } from "$fresh/runtime.ts";
import { LegalChat } from "../../islands/interfaces/LegalChat.tsx";

// Using charcoal and off-white color scheme
const styles = {
  container: "max-w-4xl mx-auto px-4 py-8",
  mainHeading: "text-[#333333] text-4xl font-bold mb-8",
  section: "mb-12",
  sectionHeading: "text-[#333333] text-2xl font-semibold mb-4",
  paragraph: "text-[#333333] leading-relaxed mb-4",
  list: "list-disc ml-6 mb-4",
  listItem: "text-[#333333] mb-2",
};

export default function LegalPage() {
  return (
    <div class="bg-[#F5F5F5] min-h-screen">
      <Head>
        <title>Legal Information | Pluso</title>
      </Head>
      
      <main class={styles.container}>
        <h1 class={styles.mainHeading}>Legal Information</h1>

        <section class={styles.section}>
          <h2 class={styles.sectionHeading}>Terms of Service</h2>
          <p class={styles.paragraph}>
            By accessing and using this website, you accept and agree to be bound by the terms
            and conditions contained herein.
          </p>
          <ul class={styles.list}>
            <li class={styles.listItem}>
              Service access and usage terms
            </li>
            <li class={styles.listItem}>
              User responsibilities and conduct
            </li>
            <li class={styles.listItem}>
              Intellectual property rights
            </li>
          </ul>
        </section>

        <section class={styles.section}>
          <h2 class={styles.sectionHeading}>Privacy Policy</h2>
          <p class={styles.paragraph}>
            We respect your privacy and are committed to protecting your personal data.
            This privacy policy informs you about how we handle your data.
          </p>
          <ul class={styles.list}>
            <li class={styles.listItem}>
              Data collection and usage
            </li>
            <li class={styles.listItem}>
              Information security
            </li>
            <li class={styles.listItem}>
              Your privacy rights
            </li>
          </ul>
        </section>

        <section class={styles.section}>
          <h2 class={styles.sectionHeading}>Cookie Policy</h2>
          <p class={styles.paragraph}>
            Our website uses cookies to enhance your browsing experience and provide
            personalized services.
          </p>
        </section>

        <section class={styles.section}>
          <h2 class={styles.sectionHeading}>Contact Information</h2>
          <p class={styles.paragraph}>
            For any legal inquiries or concerns, please contact us at:
            <br />
            Email: legal@pluso.ai
          </p>
        </section>
      </main>
    </div>
  );
}