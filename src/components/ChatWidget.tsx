import { useEffect, useId, useRef, useState } from "react";
import "./ChatWidget.css";
import andySprite from "../images/andy-pixel-sprites.png";

type Msg = { role: "user" | "assistant"; content: string };
function AndyAvatar({ thinking = false }: { thinking?: boolean }) {
  const id = useId();
  return <span className={`ai-avatar ${thinking ? "is-thinking" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 1280 1280" className="ai-avatar-face">
      <defs><filter id={id} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 .2126 .7152 .0722 0 0" />
        <feComponentTransfer><feFuncA type="linear" slope="255" intercept="-18" /></feComponentTransfer>
        <feMorphology operator="dilate" radius="6" result="mask" />
        <feComposite in="SourceGraphic" in2="mask" operator="in" />
      </filter></defs>
      <image href="/andy-pixel-head.png" width="1280" height="1280" filter={`url(#${id})`} />
      {thinking && <g><path d="M465 890H670V1030H465Z" fill="#efb689" /><path d="M505 952H620" stroke="#79503c" strokeWidth="24" /><path d="M352 730H432M726 714H797" stroke="#4a3028" strokeWidth="24" /></g>}
    </svg>
    {thinking && <span className="ai-thought"><span /></span>}
  </span>;
}

function InviteAndy() {
  const id = useId();
  return <svg className="ai-invite-sprite" viewBox="1065 32 430 470" aria-hidden="true" focusable="false">
    <defs><filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 .2126 .7152 .0722 0 0" />
      <feComponentTransfer><feFuncA type="linear" slope="255" intercept="-18" /></feComponentTransfer>
      <feMorphology operator="dilate" radius="3" result="mask" />
      <feComposite in="SourceGraphic" in2="mask" operator="in" />
    </filter></defs>
    <image href={andySprite} width="1536" height="1024" filter={`url(#${id})`} />
  </svg>;
}

export default function ChatWidget() {
  const [invite, setInvite] = useState(false);
  const inviteSeen = useRef(false);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const contact = document.getElementById('contact-title');
    if (!contact) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !inviteSeen.current) {
        inviteSeen.current = true;
        setInvite(true);
        timer = setTimeout(() => setInvite(false), 7000);
      } else if (!entry.isIntersecting) {
        clearTimeout(timer);
        inviteSeen.current = false;
        setInvite(false);
      }
    }, { threshold: .5 });
    observer.observe(contact);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);
  const close = () => { setOpen(false); requestAnimationFrame(() => launcherRef.current?.focus()); };
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); requestAnimationFrame(() => launcherRef.current?.focus()); }
      if (e.key === "Tab") {
        const items = panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "instant" });
  }, [msgs, isSending, open]);

  async function send(question = input) {
    if (!question.trim() || isSending) return;
    const userMsg: Msg = { role: "user", content: question.trim() };
    setMsgs((m) => [...m, userMsg]); setInput(""); setIsSending(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: userMsg.content }), signal: AbortSignal.timeout(55_000),
      });
      const j: { answer?: string } = await r.json().catch(() => ({}));
      if (!r.ok || !j.answer?.trim()) throw new Error("unavailable");
      setMsgs((m) => [...m, { role: "assistant", content: j.answer! }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, I couldn't get an answer just now. Please try again in a moment." }]);
    } finally { setIsSending(false); inputRef.current?.focus(); }
  }

  return <>
    <button ref={launcherRef} className={`ai-fab ${open ? "is-hidden" : ""}`} onClick={() => { setOpen(true); setInvite(false); inviteSeen.current = true; }} aria-label="Ask Andy's Assistant about Andy" aria-expanded={open}>
      {!open && <span className="ai-contact-invite" data-active={invite} aria-hidden="true">
        <span className="ai-invite-label">Ask me about Andy!</span>
        <span className="ai-invite-window"><span className="ai-invite-person">
          <InviteAndy />
        </span></span>
      </span>}
      <AndyAvatar /><span>Ask Andy's Assistant</span>
    </button>
    {open && <div className="ai-panel" role="dialog" aria-modal="true" aria-labelledby="andy-chat-title">
      <div className="ai-card" ref={panelRef}>
        <div className="ai-card-head">
          <div className="ai-card-title"><AndyAvatar /><div><strong id="andy-chat-title">Ask Andy's Assistant</strong><small>AI guide to Andy's world</small></div></div>
          <button className="ai-close" onClick={close} aria-label="Close chat"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </div>
        <div className="ai-messages" ref={messagesRef} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
          <div className="ai-message assistant"><AndyAvatar /><div className="ai-bubble assistant">Hi there! I'm Andy's AI assistant. Ask me anything about his skills, projects, experience, or how to get in touch.</div></div>
          {msgs.length === 0 && <div className="ai-suggestions">{["What does Andy build?", "Tell me about his AI projects"].map(q => <button key={q} onClick={() => void send(q)}>{q}<span aria-hidden="true"> {"\u2197"}</span></button>)}</div>}
          {msgs.map((m, i) => <div key={i} className={`ai-message ${m.role}`}>
            {m.role === "assistant" && <AndyAvatar />}
            <div className={`ai-bubble ${m.role}`}><span className="ai-sr-only">{m.role === "user" ? "You: " : "Andy's assistant: "}</span>{m.content}</div>
          </div>)}
          {isSending && <div className="ai-processing" role="status" aria-label="Andy's assistant is thinking">
            <div className="ai-message assistant"><AndyAvatar thinking /><div className="ai-bubble assistant ai-typing" aria-hidden="true">Thinking<span className="ai-typing-dots"><span>.</span><span>.</span><span>.</span></span></div></div>
          </div>}
        </div>
        <form className="ai-input" onSubmit={e => { e.preventDefault(); void send(); }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything about Andy..." aria-label="Your question about Andy" maxLength={800} />
          <button type="submit" className="ai-send" aria-label="Send message" disabled={isSending || !input.trim()}><i className="fa-solid fa-arrow-up" aria-hidden="true" /></button>
        </form>
        <p className="ai-footnote">Powered by AI. A little help getting to know Andy.</p>
      </div>
    </div>}
  </>;
}
