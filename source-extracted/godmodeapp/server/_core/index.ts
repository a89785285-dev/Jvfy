import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { createCorsMiddleware } from "./cors";
import { clearLegacySessionCookie } from "./cookies";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Render and similar reverse-proxy hosts forward the real client IP in X-Forwarded-For.
  app.set("trust proxy", 1);

  // Protect the public AI mutation from accidental or abusive high-volume usage.
  const aiRequestWindows = new Map<string, { startedAt: number; count: number }>();
  app.use("/api/trpc/godmode.run", (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const current = aiRequestWindows.get(ip);
    if (!current || now - current.startedAt >= 60_000) {
      aiRequestWindows.set(ip, { startedAt: now, count: 1 });
    } else if (current.count >= 8) {
      res.status(429).json({ error: "Too many AI requests. Please wait one minute and try again." });
      return;
    } else {
      current.count += 1;
    }

    // Bound memory use if many distinct clients reach the service.
    if (aiRequestWindows.size > 5000) {
      for (const [key, value] of aiRequestWindows) {
        if (now - value.startedAt >= 60_000) aiRequestWindows.delete(key);
      }
    }
    next();
  });

  app.use(createCorsMiddleware());
  app.use(clearLegacySessionCookie());

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, () => {
    console.log("[api] server listening");
  });
}

startServer().catch((error) => {
  console.error("[api] server failed to start", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
