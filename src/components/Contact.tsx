// src/components/Contact.tsx
import { useState } from "react";
import CoffeeChat from "./CoffeeChat";
import CVModal from "./CVModal";
import SectionHead from "./SectionHead";
import ArrowIcon from "./ArrowIcon";
import useScrollReveal from "../hook/useScrollReveal.ts";
import contact from "../data/contact.json";
import { openAssistant } from "../utils/assistant";

const EMAIL = contact.email;
const PHONE = contact.phone;
const [EMAIL_USER, EMAIL_DOMAIN] = EMAIL.split("@");

export default function Contact() {
  const [openCV, setOpenCV] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const bodyRef = useScrollReveal<HTMLDivElement>();

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead label="contact" title="Say hello" titleId="contact-title" aside={<CoffeeChat />}>
          Open to internships, freelance work and questions about any of the projects. Email, phone or socials all work.
        </SectionHead>

        <div className="contact-body reveal-stagger" ref={bodyRef}>
          <div className="contact-email-row">
            <a className="contact-email" href={`mailto:${EMAIL}`}>
              {EMAIL_USER}<wbr />@{EMAIL_DOMAIN}
            </a>
            <button className="btn btn-ghost btn-small" type="button" onClick={() => copy(EMAIL, "Email")}>
              <i className="fa-regular fa-copy" aria-hidden="true" /> Copy email
            </button>
          </div>

          <ul className="contact-links">
            <li>
              <span className="contact-label">Phone</span>
              <span className="contact-value">
                <a href={`tel:${PHONE.replace(/\s+/g, "")}`}>{PHONE}</a>
                <button className="icon-btn" type="button" onClick={() => copy(PHONE, "Phone number")} aria-label="Copy phone number" title="Copy phone number">
                  <i className="fa-regular fa-copy" aria-hidden="true" />
                </button>
              </span>
            </li>
            <li>
              <span className="contact-label">LinkedIn</span>
              <a className="contact-value" href={contact.linkedin} target="_blank" rel="noreferrer">andy-saputra <ArrowIcon /></a>
            </li>
            <li>
              <span className="contact-label">Instagram</span>
              <a className="contact-value" href={contact.instagram} target="_blank" rel="noreferrer">@anditific <ArrowIcon /></a>
            </li>
            <li>
              <span className="contact-label">Curriculum vitae</span>
              <button className="contact-value" type="button" onClick={() => setOpenCV(true)}>View or download CV <ArrowIcon /></button>
            </li>
          </ul>

          <p className="contact-assistant">
            <span>Rather ask a few questions first?</span>
            <button type="button" className="text-link" onClick={openAssistant}>
              Ask my AI assistant about my work <ArrowIcon direction="right" />
            </button>
          </p>
        </div>
        <div className="copy-toast" role="status" aria-live="polite">{copied ? `${copied} copied to clipboard` : ""}</div>
      </div>

      <CVModal open={openCV} onClose={() => setOpenCV(false)} />
    </section>
  );
}
