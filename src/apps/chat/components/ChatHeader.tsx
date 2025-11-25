import { useChat } from "../../../hooks/useChat";
import { useEffect, useRef, useState } from "react";
import { CHAT_TEXT } from "../uiConfig";

export function ChatHeader() {
  const { currentSession, renameSession, isLoading, theme, toggleTheme } = useChat();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setValue(currentSession?.title ?? "");
  }, [currentSession?.id, currentSession?.title]);

  const commit = () => {
    if (!currentSession) return setEditing(false);
    const v = value.trim();
    if (v && v !== currentSession.title) renameSession(currentSession.id, v);
    setEditing(false);
  };

  return (
    <header
      className={
        "sticky top-0 z-30 border-b backdrop-blur px-4 py-3 " +
        (isDark ? "border-zinc-800 bg-zinc-900/70" : "border-[#E5E7EB] bg-[#F9FAFB]/80")
      }
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setEditing(false);
              }}
              className={
                "rounded-md px-2 py-1 text-sm w-full max-w-md focus:outline-none focus:ring-2 " +
                (isDark
                  ? "bg-zinc-900 text-zinc-100 border border-zinc-700 focus:ring-indigo-600"
                  : "bg-white text-[#1F2937] border border-[#D1D5DB] focus:ring-[#5A31F4]/70")
              }
            />
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-sm " +
                    (isDark ? "bg-indigo-600/90" : "bg-[#5A31F4]")
                  }
                >
                  AST
                </span>
                <h1
                  className={
                    "text-base font-semibold cursor-text truncate " +
                    (isDark
                      ? "text-zinc-100 hover:text-zinc-50"
                      : "text-[#1F2937] hover:text-[#111827]")
                  }
                  title="Haz clic para renombrar"
                  onClick={() => setEditing(true)}
                >
                  {currentSession?.title ?? "Nuevo chat"}
                </h1>
              </div>
              <p
                className={
                  "text-xs truncate " + (isDark ? "text-zinc-400" : "text-[#6B7280]")
                }
              >
                {CHAT_TEXT.headerDescription}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={
              "inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs focus:outline-none focus:ring-2 transition-colors " +
              (isDark
                ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 focus:ring-zinc-500/70"
                : "border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F3F4F6] focus:ring-[#5A31F4]/50")
            }
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="4" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 4.95-1.414-1.414M6.464 6.464 5.05 5.05m0 13.9 1.414-1.414M17.536 6.464 18.95 5.05"
                />
              </svg>
            )}
          </button>
          {isLoading && (
            <div className="hidden md:flex items-center gap-2 text-xs text-[#059669]">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Analizando codigo...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
