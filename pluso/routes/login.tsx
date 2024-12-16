import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import LoginForm from "../islands/auth/LoginForm.tsx";

export default function LoginPage(props: PageProps) {
  return (
    <>
      <Head>
        <title>Login - PluSO</title>
      </Head>
      <LoginForm />
    </>
  );
}
