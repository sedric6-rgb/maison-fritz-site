"use client";

export default function CrmMessageBubble({
  sender,
  body,
  time,
  isAi = false,
  isOwn = false,
}: {
  sender: string;
  body: string;
  time: string;
  isAi?: boolean;
  isOwn?: boolean;
}) {
  const formattedTime = (() => {
    try {
      return new Date(time).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  })();

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold ${
          isAi
            ? "bg-[#ad7f34]/20 text-[#ad7f34]"
            : isOwn
              ? "bg-[#1e3b34] text-[#9da89e]"
              : "bg-[#2a4a3f] text-[#b0c0b3]"
        }`}
      >
        {isAi ? "✦" : sender.charAt(0).toUpperCase()}
      </div>
      <div className={`max-w-[80%] ${isOwn ? "text-right" : ""}`}>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-[13px] font-bold ${
              isAi ? "text-[#ad7f34]" : "text-white"
            }`}
          >
            {sender}
          </span>
          <span className="text-[10px] text-[#6b7a6e]">{formattedTime}</span>
        </div>
        <div
          className={`mt-1 rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
            isAi
              ? "border border-[#ad7f34]/20 bg-[#1a2f26] text-[#d4e0d6]"
              : isOwn
                ? "bg-[#1e3b34] text-[#d4e0d6]"
                : "bg-[#162e28] text-[#d4e0d6]"
          }`}
        >
          {body.split("\n").map((line, i) => (
            <p key={i} className={i > 0 ? "mt-1.5" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
