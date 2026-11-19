import express from "express";
import type { Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { createCorsMiddleware } from "./cors";
import { clearLegacySessionCookie } from "./cookies";

/**
 * Attach GODMODE API routes and middleware to an Express app.
 * The app can then be exported to Vercel or listened to by the standalone server.
 */
export function configureApp(app: Express): Express {
  // Vercel, Render, and similar reverse-proxy hosts forward the client IP.
  app.set("trust proxy", 1);

  app.use(createCorsMiddleware());

  // Best-effort per-instance protection for the public AI mutation.
  // This is not a persistent or globally shared quota across server instances.
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

    if (aiRequestWindows.size > 5000) {
      for (const [key, value] of aiRequestWindows) {
        if (now - value.startedAt >= 60_000) aiRequestWindows.delete(key);
      }
    }
    next();
  });

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

  return app;
}
