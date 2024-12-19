import { Handlers } from "$fresh/server.ts";
import { h } from "preact";
import LoginForm from "../../islands/auth/LoginForm.tsx";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
};

export default function LoginPage() {
  return h(LoginForm, null);
}
