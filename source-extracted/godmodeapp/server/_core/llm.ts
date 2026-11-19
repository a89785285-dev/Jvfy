import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = { type: "text"; text: string };
export type ImageContent = {
  type: "image_url";
  image_url: { url: string; detail?: "auto" | "low" | "high" };
};
export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4";
  };
};
export type MessageContent = string | TextContent | ImageContent | FileContent;
export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type InvokeParams = {
  messages: Message[];
  maxTokens?: number;
  max_tokens?: number;
  model?: string;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: "assistant"; content: string };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

type ResponsesApiResult = {
  id?: string;
  created_at?: number;
  model?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  output_text?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
};

const apiBaseUrl = () => {
  const configured = ENV.aiApiUrl.trim().replace(/\/+$/, "") || "https://api.openai.com";
  return configured.endsWith("/v1") ? configured : `${configured}/v1`;
};

const assertApiKey = () => {
  if (!ENV.aiApiKey.trim()) {
    throw new Error("AI_API_KEY is not configured on the server");
  }
  if (!ENV.aiModel.trim()) {
    throw new Error("AI_MODEL is not configured on the server");
  }
};

type ResponsesInputPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string; detail?: "auto" | "low" | "high" }
  | { type: "input_file"; file_url: string };

const normalizeInputPart = (part: MessageContent): ResponsesInputPart => {
  if (typeof part === "string") return { type: "input_text", text: part };
  if (part.type === "text") return { type: "input_text", text: part.text };
  if (part.type === "image_url") {
    return {
      type: "input_image",
      image_url: part.image_url.url,
      ...(part.image_url.detail ? { detail: part.image_url.detail } : {}),
    };
  }
  return {
    type: "input_file",
    file_url: part.file_url.url,
  };
};

const normalizeInputMessage = (message: Message) => {
  const role = message.role === "tool" || message.role === "function" ? "user" : message.role;
  const parts = Array.isArray(message.content) ? message.content : [message.content];
  const normalized = parts.map(normalizeInputPart);
  const firstPart = normalized[0];
  const content =
    normalized.length === 1 && firstPart.type === "input_text"
      ? firstPart.text
      : normalized;
  return { role, content };
};

const RETRY_MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 500;
const RETRY_MAX_DELAY_MS = 15_000;
type FetchInit = NonNullable<Parameters<typeof fetch>[1]>;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const parseRetryAfter = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const at = Date.parse(value);
  return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
};

const computeBackoffDelay = (attempt: number, retryAfterMs?: number): number => {
  const cap = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
  const jittered = cap / 2 + Math.random() * (cap / 2);
  return Math.min(Math.max(jittered, retryAfterMs ?? 0), RETRY_MAX_DELAY_MS);
};

const fetchWithBackoff = async (url: string, init: FetchInit): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, init);
      const retryable = response.status === 429 || response.status >= 500;
      if (response.ok || !retryable || attempt === RETRY_MAX_RETRIES) return response;

      const retryAfterMs = parseRetryAfter(response.headers.get("retry-after"));
      try {
        await response.body?.cancel();
      } catch {
        // The response body may already be consumed or closed.
      }
      console.warn("[AI] Provider returned a retryable status; retry scheduled.");
      await sleep(computeBackoffDelay(attempt, retryAfterMs));
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_MAX_RETRIES) throw error;
      console.warn("[AI] Provider connection failed; retry scheduled.");
      await sleep(computeBackoffDelay(attempt));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("AI request failed after retries");
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  assertApiKey();

  const url = `${apiBaseUrl()}/responses`;
  const payload = {
    model: params.model || ENV.aiModel,
    input: params.messages.map(normalizeInputMessage),
    max_output_tokens: params.max_tokens ?? params.maxTokens ?? 1600,
  };

  const response = await fetchWithBackoff(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.aiApiKey.trim()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Avoid returning provider response bodies to the mobile client.
    const providerError = await response.text();
    console.error("[AI] Provider request failed", response.status, providerError.slice(0, 500));
    throw new Error(`AI provider request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ResponsesApiResult;
  const outputText =
    data.output_text?.trim() ||
    (data.output ?? [])
      .flatMap((item) => item.content ?? [])
      .filter((part) => part.type === "output_text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("\n")
      .trim();

  return {
    id: data.id ?? "response",
    created: data.created_at ?? Math.floor(Date.now() / 1000),
    model: data.model ?? params.model ?? ENV.aiModel,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: outputText },
        finish_reason: "stop",
      },
    ],
    usage: data.usage
      ? {
          prompt_tokens: data.usage.input_tokens ?? 0,
          completion_tokens: data.usage.output_tokens ?? 0,
          total_tokens: data.usage.total_tokens ?? 0,
        }
      : undefined,
  };
}

export type ModelInfo = {
  id: string;
  object: string;
  created: number;
  owned_by: string;
};

export type ModelsResponse = {
  object: string;
  data: ModelInfo[];
};

export async function listLLMModels(): Promise<ModelsResponse> {
  assertApiKey();
  const response = await fetchWithBackoff(`${apiBaseUrl()}/models`, {
    headers: { authorization: `Bearer ${ENV.aiApiKey.trim()}` },
  });

  if (!response.ok) {
    throw new Error(`List AI models failed with status ${response.status}`);
  }

  return (await response.json()) as ModelsResponse;
}
