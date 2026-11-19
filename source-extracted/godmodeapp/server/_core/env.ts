export const ENV = {
  appId: process.env.MANUS_PROJECT_ID ?? process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.MANUS_JWT_SECRET ?? process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.MANUS_OAUTH_API_URL ?? process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // Legacy Manus Forge settings remain isolated for the optional storage and notification proxies.
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",

  // AI provider credentials are server-only and never exposed to the mobile app.
  aiApiUrl: process.env.AI_API_BASE_URL ?? "https://api.openai.com",
  aiApiKey: process.env.AI_API_KEY ?? "",
  aiModel: process.env.AI_MODEL ?? "gpt-6-luna",
};
