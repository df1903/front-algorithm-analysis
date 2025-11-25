import type { ChatMessage } from "../../../interfaces/chat";
import { useChat } from "../../../hooks/useChat";
import { ERROR_TEXT } from "../uiConfig";

function renderContent(content: string, isDark: boolean) {
  if (content.startsWith("```")) {
    const stripped = content.replace(/^```[a-z]*\n?/i, "").replace(/```\s*$/i, "");
    return (
      <pre
        className={
          "whitespace-pre-wrap text-[12px] md:text-sm border p-4 rounded-xl overflow-auto font-mono shadow-inner " +
          (isDark
            ? "bg-zinc-950/95 text-zinc-100 border-zinc-800"
            : "bg-[#F3F4F6] text-[#1F2937] border-[#E5E7EB]")
        }
      >
        <code>{stripped}</code>
      </pre>
    );
  }
  return (
    <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{content}</p>
  );
}

function classifyError(content: string): "network" | "analysis" | "generic" {
  const lower = content.toLowerCase();
  if (lower.includes("failed to fetch") || lower.includes("network")) return "network";
  if (lower.includes("http 400") || lower.includes("http 422") || lower.includes("error construyendo ast")) {
    return "analysis";
  }
  return "generic";
}

export function MessageItem({ message }: { message: ChatMessage }) {
  const { retryLast, isLoading, theme } = useChat();
  const isDark = theme === "dark";
  const isUser = message.role === "user";
  const isError = !isUser && /^\s*error:/i.test(message.content);

  const bubbleBase = "w-full rounded-2xl px-4 py-3 shadow-sm";
  const bubbleClasses = isUser
    ? isDark
      ? "bg-indigo-600 text-white"
      : "bg-[#E0E7FF] text-[#1F2937]"
    : isError
      ? "bg-red-50 border border-red-300 text-red-700"
      : isDark
        ? "bg-zinc-900/95 border border-zinc-800 text-zinc-100"
        : "bg-[#F3F4F6] border border-[#E5E7EB] text-[#1F2937]";

  const errorType = isError ? classifyError(message.content) : null;
  const friendlyText =
    errorType === "network"
      ? ERROR_TEXT.networkFriendly
      : errorType === "analysis"
        ? ERROR_TEXT.analysisFriendly
        : ERROR_TEXT.genericFriendly;
  const hintText =
    errorType === "network"
      ? ERROR_TEXT.networkHint
      : errorType === "analysis"
        ? ERROR_TEXT.analysisHint
        : ERROR_TEXT.genericHint;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <span
          className={
            "text-[11px] uppercase tracking-wide " +
            (isDark ? "text-zinc-500" : "text-[#6B7280]")
          }
        >
          {isUser ? "Tu" : "Analizador"}
        </span>
        <div className={`${bubbleBase} ${bubbleClasses}`}>
          {isError ? (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86l-8.1 14A2 2 0 0 0 3.81 21h16.38a2 2 0 0 0 1.72-3.14l-8.1-14a2 2 0 0 0-3.52 0Z"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm md:text-base leading-relaxed font-medium">
                    {friendlyText}
                  </p>
                  <p className="text-[11px] text-red-500/80">{hintText}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => retryLast()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-red-100/70 px-2 py-1 text-red-700 hover:bg-red-100 disabled:opacity-50"
                  title="Reintentar el ultimo mensaje"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12a7.5 7.5 0 0 1 12.364-5.303M19.5 12a7.5 7.5 0 0 1-12.364 5.303M3 3v6h6"
                    />
                  </svg>
                  Reintentar
                </button>
                <details className="text-[11px] text-red-500/70">
                  <summary className="cursor-pointer select-none">Ver detalle tecnico</summary>
                  <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-snug">
                    {message.content}
                  </pre>
                </details>
              </div>
            </div>
          ) : (
            renderContent(message.content, isDark)
          )}
        </div>
      </div>
    </div>
  );
}
