"use client";

import { useState, useRef } from "react";

export default function CrmComposer({
  onSend,
  placeholder = "Écrire un message…",
  disabled = false,
}: {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-[#2a4a3f] bg-[#0e211c] px-4 py-3">
      <div className="flex items-end gap-2 rounded-lg border border-[#2a4a3f] bg-[#162e28] px-3 py-2">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="max-h-24 min-h-[36px] flex-1 resize-none bg-transparent text-[14px] text-white placeholder-[#6b7a6e] outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="rounded-md bg-[#ad7f34] px-3 py-1.5 text-[12px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-30"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
