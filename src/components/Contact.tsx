// src/components/Contact.tsx
import { useState, type CSSProperties, type FormEvent } from "react";
import CVModal from "./CVModal";
import useScrollReveal from "../hook/useScrollReveal.ts";

const EMAIL = "andychensaputra@gmail.com";
const PHONE  = "+6281995247372";

const si = (i: number) => ({ ["--i" as any]: i } as CSSProperties);

export default function Contact() {
  const [openCV, setOpenCV] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg,  setMsg]  = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  // reveal refs
  const leftRef    = useScrollReveal<HTMLDivElement>();
  const socialsRef = useScrollReveal<HTMLDivElement>();
  const listRef    = useScrollReveal<HTMLUListElement>();
  const nudgeRef   = useScrollReveal<HTMLDivElement>();
  const formRef    = useScrollReveal<HTMLFormElement>();   // << penting

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !from || !msg) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: from, message: msg }),
      });
      if (!r.ok) throw new Error("failed");
      setStatus("sent");
      setName(""); setFrom(""); setMsg("");
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
      // fallback biar user tetap bisa kirim
      const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
        `Portfolio Contact — ${name}`
      )}&body=${encodeURIComponent(`${msg}\n\nFrom: ${from}`)}`;
      window.open(mailto, "_blank");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="section-center">
        <div className="contact-card">
          {/* Left */}
          <div className="contact-left reveal-stagger" ref={leftRef}>
            <h2 id="contact-title" className="reveal" style={si(0)}>
              Get in Touch
            </h2>
            <p className="reveal" style={si(1)}>
              I’m always open to discussing new projects, collaboration, or any
              opportunities. Reach me via email/phone below, or through my socials.
            </p>

            <div className="contact-socials reveal-stagger" ref={socialsRef}>
              <a className="social-btn ig reveal" style={si(0)}
                 href="https://instagram.com/anditific" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-instagram" /> Instagram
              </a>

              <a className="social-btn li reveal" style={si(1)}
                 href="https://linkedin.com/in/andy-saputra-586b22247" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-linkedin" /> LinkedIn
              </a>

              <button className="social-btn cv reveal" style={si(2)} onClick={() => setOpenCV(true)} type="button">
                <i className="fa-regular fa-file-lines" /> Get My CV
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="contact-right">
            {/* Email & phone */}
            <ul className="contact-list reveal-stagger" ref={listRef}>
              <li className="contact-row reveal" style={si(0)}>
                <div className="contact-id">
                  <i className="fa-solid fa-envelope" />
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
                <button className="copy-btn" onClick={() => copy(EMAIL)} aria-label="Copy email" title="Copy" type="button">
                  <i className="fa-regular fa-copy" />
                </button>
              </li>

              <li className="contact-row reveal" style={si(1)}>
                <div className="contact-id">
                  <i className="fa-solid fa-phone" />
                  <a href={`tel:${PHONE.replace(/\s+/g, "")}`}>{PHONE}</a>
                </div>
                <button className="copy-btn" onClick={() => copy(PHONE)} aria-label="Copy phone number" title="Copy" type="button">
                  <i className="fa-regular fa-copy" />
                </button>
              </li>
            </ul>

            {copied && <div className="copy-toast">Copied!</div>}

            {/* Form */}
            <form className="contact-form reveal-stagger" ref={formRef} onSubmit={handleSend} noValidate>
              <div className="cf-row reveal" style={si(0)}>
                <label className="sr-only" htmlFor="cf-name">Full Name</label>
                <input id="cf-name" className="cf-input" type="text" placeholder="Full Name"
                       value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="cf-row reveal" style={si(1)}>
                <label className="sr-only" htmlFor="cf-email">Email Address</label>
                <input id="cf-email" className="cf-input" type="email" placeholder="Email Address"
                       value={from} onChange={(e) => setFrom(e.target.value)} required />
              </div>

              <div className="cf-row reveal" style={si(2)}>
                <label className="sr-only" htmlFor="cf-message">Message</label>
                <textarea id="cf-message" className="cf-textarea" rows={4} placeholder="Message"
                          value={msg} onChange={(e) => setMsg(e.target.value)} required />
              </div>

              <button className="btn cf-send reveal" style={si(3)} type="submit" disabled={status === "sending"}>
                {status === "sending"
                  ? (<><i className="fa-solid fa-circle-notch fa-spin" /> Sending…</>)
                  : (<><i className="fa-solid fa-paper-plane" /> Send Message</>)
                }
              </button>

              {status === "sent"  && <div className="cf-note ok reveal"  style={si(4)}>Message sent ✅</div>}
              {status === "error" && <div className="cf-note err reveal" style={si(4)}>Failed to send ❌</div>}
            </form>
          </div>
        </div>
      </div>

      <CVModal open={openCV} onClose={() => setOpenCV(false)} />

      {/* Nudge bawah */}
      <div className="ai-nudge reveal" ref={nudgeRef} style={si(0)} role="note" aria-label="Try AI widget">
        <span className="ai-nudge-pill">
          <i className="fa-regular fa-message" />
          <span>Try <strong>Ask AI About Me</strong>—you’ll find it right below! 😉</span>
        </span>
      </div>
    </section>
  );
}
