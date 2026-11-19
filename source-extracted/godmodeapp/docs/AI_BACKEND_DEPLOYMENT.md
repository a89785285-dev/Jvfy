# GODMODE AI backend deployment

This project has two separate deliverables:

- Android app (Expo/EAS): contains only the public HTTPS URL of the backend.
- Node.js API server: holds the AI provider key and calls the provider. The provider key must never be added to the mobile app, EAS build variables, GitHub variables, or any `EXPO_PUBLIC_*` variable.

## 1. Deploy the API on Render

1. Push this branch to GitHub and create a Render Web Service from the repository.
2. Use the repository's root `render.yaml` Blueprint, or enter these settings manually:
   - Runtime: Node
   - Root directory: `source-extracted/godmodeapp`
   - Build command: `corepack enable && pnpm install --frozen-lockfile`
   - Start command: `pnpm start:server`
   - Health check path: `/api/health`
3. Set these environment variables in the Render service dashboard:
   - `AI_API_BASE_URL=https://api.openai.com`
   - `AI_MODEL=gpt-6-luna`
   - `AI_API_KEY` = the secret API key from the provider
4. Save and deploy. Do not paste the key into GitHub, chat, source files, or the APK.
5. Confirm that opening `https://YOUR-SERVICE.onrender.com/api/health` returns JSON containing `"ok":true`.

The service uses an OpenAI Responses API-compatible endpoint. For another compatible provider, set `AI_API_BASE_URL` to that provider's API root (or its `/v1` root) and set `AI_MODEL` to a model supported by that provider. Keep the API key only in the backend host's secret environment variable.

## 2. Point EAS builds at the backend

After Render gives you the service's stable HTTPS origin:

1. Open the GODMODE project in Expo/EAS.
2. Open **Environment variables** for the EAS project.
3. Add `EXPO_PUBLIC_API_BASE_URL` as a plain-text variable (not a secret), with the Render origin only, for example `https://godmode-ai-api.onrender.com`. Do not add `/api/trpc` or a trailing slash.
4. Add it to both the `preview` and `production` environments.
5. Run the existing GitHub Actions workflow **Build GODMODE Android APK** on branch `prompt-forge/inspect-source`, or trigger an EAS build with the `preview` profile.

The EAS profiles explicitly select their matching EAS environment. The app reads this public backend URL at build time.

## 3. Verify

- `GET /api/health` should return HTTP 200 and `{"ok":true,...}`.
- The app's dashboard should show the server AI engine as ready after the backend has an API key.
- In Prompt Studio, test each mode with a harmless short prompt.
- If the service returns 429, wait one minute; the public AI mutation is limited to 8 requests per IP per minute.
- If AI is not configured, check the Render service logs and its `AI_API_KEY`, `AI_API_BASE_URL`, and `AI_MODEL` settings. Never share the key when asking for help.

## Important limitations

- The API key is server-side, but the AI endpoint is public and rate-limited; this basic in-memory limit is not a substitute for user accounts, persistent quotas, or abuse monitoring at scale.
- The existing Manus OAuth/login integration is separate from AI provider authentication. This deployment guide configures the AI API only; Manus login will not work unless its OAuth environment variables and provider-side app registration are separately configured.
- Provider usage may incur charges. Review the provider's pricing and set usage limits before enabling the service.
