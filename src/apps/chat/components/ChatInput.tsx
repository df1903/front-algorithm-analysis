import { useState } from "react";
import { useChat } from "../../../hooks/useChat";
import { CHAT_TEXT } from "../uiConfig";

export function ChatInput() {
  const [value, setValue] = useState("");
  const { sendMessage, isLoading, currentSession, theme } = useChat();

  const hasMode = !!currentSession?.inputMode;
  const isDark = theme === "dark";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !hasMode) return;
    const text = value.trim();
    if (!text) return;
    sendMessage(text);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading || !hasMode) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = value.trim();
      if (!text) return;
      sendMessage(text);
      setValue("");
    }
  };

  const placeholder = !hasMode
    ? CHAT_TEXT.inputChooseModePlaceholder
    : isLoading
    ? CHAT_TEXT.inputAnalyzingPlaceholder
    : CHAT_TEXT.inputDefaultPlaceholder;

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
      <div className="flex gap-2 items-end">
        <textarea
          className={
            "flex-1 min-h-[56px] max-h-52 resize-y rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 " +
            (isDark
              ? "border border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:ring-indigo-600"
              : "border border-[#D1D5DB] bg-white text-[#1F2937] placeholder-[#9CA3AF] focus:ring-[#5A31F4]/70")
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isLoading || !hasMode}
        />
        <button
          type="submit"
          className={
            "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed " +
            (isDark
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-[#5A31F4] hover:bg-[#4A24D9]")
          }
          disabled={!value.trim() || isLoading || !hasMode}
        >
          {isLoading ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-4 animate-spin"
              >
                <circle cx="12" cy="12" r="9" className="opacity-25" />
                <path d="M21 12a9 9 0 0 1-9 9" className="opacity-75" />
              </svg>
              Analizando
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path d="M6.672 3.853a.75.75 0 0 1 .788-.056l13.5 7.5a.75.75 0 0 1 0 1.306l-13.5 7.5A.75.75 0 0 1 6 19.5v-5.318a.75.75 0 0 1 .53-.717l8.46-2.82-8.46-2.82A.75.75 0 0 1 6 7.108V3.75a.75.75 0 0 1 .672-.897Z" />
              </svg>
              Enviar
            </>
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-zinc-400 text-center">
        Se enviara al endpoint /api/analyzer/ast como <code>{'{ text: "..." }'}</code>
      </p>
    </form>
  );
}
