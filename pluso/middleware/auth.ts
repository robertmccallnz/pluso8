// pluso/middleware/auth.ts
export async function authMiddleware(req: Request, ctx: Context) {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return new Response("Unauthorized", { status: 401 });
    }
    return await ctx.next();
  }
  