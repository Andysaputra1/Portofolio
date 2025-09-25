import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);


  // close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // auto focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // click outside to close (optional, only when small screens)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // kalau kamu mau tidak auto close pada click backdrop, hapus baris ini
        // setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

useEffect(() => {
  messagesRef.current?.scrollTo({
    top: messagesRef.current.scrollHeight,
    behavior: "smooth",
  });
}, [msgs]);


  async function send() {
    if (!input.trim()) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");

    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: userMsg.content }),
      });
      const j: { answer?: string } = await r.json();
      setMsgs((m) => [...m, { role: "assistant", content: j.answer ?? "No answer." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Maaf, server error. Coba lagi ya." }]);
    }
  }

  return (
    <>
      {/* Floating Button */}
    <button
  className={`ai-fab ${open ? "is-hidden" : ""}`}
  onClick={() => setOpen(true)}
  aria-label="Ask AI About Me"
  aria-expanded={open}
>
  <i className="fa-regular fa-message" aria-hidden="true"></i>
  <span>Ask AI About Me</span>
</button>

      {/* Panel */}
      {open && (
        <div className="ai-panel" role="dialog" aria-modal="true" aria-label="Ask AI About Me">
          <div className="ai-card" ref={panelRef}>
            <div className="ai-card-head">
              <div className="ai-card-title">
                <i className="fa-solid fa-robot"></i>
                <span>Ask AI About Me</span>
              </div>
              <button className="ai-close" onClick={() => setOpen(false)} aria-label="Close">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="ai-messages" id="ai-messages" ref={messagesRef}>
              {msgs.length === 0 && (
                <div className="ai-empty">
                  Tanyakan apa saja tentang saya, skill, project, atau kontak. 😊
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`ai-bubble ${m.role}`}>
                  {m.content}
                </div>
              ))}
            </div>

            <div className="ai-input">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Tulis pertanyaanmu…"
                aria-label="Chat input"
              />
              <button onClick={send} className="ai-send" aria-label="Send">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
