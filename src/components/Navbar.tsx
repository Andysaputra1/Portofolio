import { useEffect, useRef, useState } from "react";
import { pageLinks, socialLinks } from "../data";
import CVModal from "./CVModal";
import NavRunner from './NavRunner';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`); });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); navRef.current?.querySelector<HTMLButtonElement>(".nav-toggle")?.focus(); }
    };
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [open]);

  // Transparent over the hero, solid once the page has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The dropdown only exists below the desktop breakpoint.
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 992) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header ref={navRef} className="topbar" data-open={open} data-scrolled={scrolled}>
        <a className="brand" href="#home" aria-label="Andy Saputra, back to top" onClick={close}>
          <NavRunner />
          <span className="brand-word">andy<span>.</span></span>
        </a>

        <nav className="nav-menu" aria-label="Main">
          <ul id="nav-links" className="nav-links">
            {pageLinks.map((link) => (
              <li key={link.id}>
                <a href={link.href} className={`nav-link ${activeSection === link.href ? "is-active" : ""}`} aria-current={activeSection === link.href ? "location" : undefined} onClick={close}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <ul className="nav-socials">
            {socialLinks.map(({ id, href, icon, label }) => (
              <li key={id}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="nav-icon" aria-label={`${label} (opens in a new tab)`} title={label}>
                  <i className={icon} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-ghost btn-small" onClick={() => setCvOpen(true)}>
            <i className="fa-regular fa-file-lines" aria-hidden="true" />
            <span>CV</span>
          </button>
          <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((value) => !value)}>
            <span className="nav-toggle-bars" aria-hidden="true"><i /><i /><i /></span>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </header>

      <CVModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  );
}
