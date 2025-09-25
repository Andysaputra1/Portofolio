// src/components/Contact.tsx
import { useState } from "react";
import CVModal from "./CVModal";

const EMAIL = "andychensaputra@gmail.com";      // ganti kalau perlu
const PHONE = "+6281995247372";               // ganti nomor kamu

export default function Contact() {
  const [openCV, setOpenCV] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="section-center">
        <div className="contact-card">
          {/* Left */}
          <div className="contact-left">
            <h2 id="contact-title">Get in Touch</h2>
            <p>
              I’m always open to discussing new projects, collaboration, or any
              opportunities. Reach me via email/phone below, or through my socials.
            </p>

            <div className="contact-socials">
              <a
                className="social-btn ig"
                href="https://instagram.com/anditific"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-instagram" /> Instagram
              </a>

              <a
                className="social-btn li"
                href="https://linkedin.com/in/andy-saputra-586b22247"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-linkedin" /> LinkedIn
              </a>

              <button className="social-btn cv" onClick={() => setOpenCV(true)}>
                <i className="fa-regular fa-file-lines" /> Get My CV
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="contact-right">
            <ul className="contact-list">
              <li className="contact-row">
                <div className="contact-id">
                  <i className="fa-solid fa-envelope" />
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
                <button
                  className="copy-btn"
                  onClick={() => copy(EMAIL)}
                  aria-label="Copy email"
                  title="Copy"
                >
                  <i className="fa-regular fa-copy" />
                </button>
              </li>

              <li className="contact-row">
                <div className="contact-id">
                  <i className="fa-solid fa-phone" />
                  <a href={`tel:${PHONE.replace(/\s+/g, "")}`}>{PHONE}</a>
                </div>
                <button
                  className="copy-btn"
                  onClick={() => copy(PHONE)}
                  aria-label="Copy phone number"
                  title="Copy"
                >
                  <i className="fa-regular fa-copy" />
                </button>
              </li>
            </ul>

            {copied && <div className="copy-toast">Copied!</div>}
          </div>
        </div>
      </div>

      <CVModal open={openCV} onClose={() => setOpenCV(false)} />


      {/* Nudge paling bawah */}
      <div className="ai-nudge" role="note" aria-label="Try AI widget">
        <span className="ai-nudge-pill">
          <i className="fa-regular fa-message" />
          <span>
           Try <strong>Ask AI About Me</strong>—you’ll find it right below! 😉
          </span>
        </span>
      </div>

    </section>

  );
}
