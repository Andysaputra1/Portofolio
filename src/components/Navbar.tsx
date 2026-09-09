// Navbar.tsx (Sudah Diperbaiki)

import { useEffect, useRef, useState } from "react";
import { pageLinks, socialLinks } from "../data";
import CVModal from "./CVModal";
import NavRunner from './NavRunner';

export default function Navbar() {
  const [open, setOpen] = useState(false); // menu mobile
  const [cvOpen, setCvOpen] = useState(false); // state untuk CV modal
  const [activeSection, setActiveSection] = useState("");
  const linksRef = useRef<HTMLUListElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const toggle = () => setOpen((v) => !v);
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


  // Efek untuk auto-close menu di desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxH =
    open && linksRef.current ? `${linksRef.current.scrollHeight}px` : "0px";

  return (
    <>
      <nav ref={navRef} className="navbar" role="navigation" aria-label="Main">
        <div className="nav-center">
          {/* Kiri: logo */}
          <a className="nav-header" href="#home" aria-label="Andy Saputra home" onClick={close}>
            <NavRunner />
            <span className="nav-wordmark">andy<span>.</span></span>
          </a>

          {/* Tengah (mobile: dropdown; desktop: inline) */}
          <ul
            id="nav-links"
            ref={linksRef}
            className={`nav-links ${open ? "is-open" : ""}`}
            style={{ maxHeight: maxH }}
          >
            {pageLinks.map((link) => (
              <li key={link.id}>
                <a href={link.href} className={`nav-link ${activeSection === link.href ? "is-active" : ""}`} aria-current={activeSection === link.href ? "location" : undefined} onClick={close}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>

          {/* ====================================================== */}
          {/* BARU: Kanan (HANYA TAMPIL DI DESKTOP) */}
          {/* ====================================================== */}
          <div className="nav-right">
            <ul className="nav-icons">
              {socialLinks.map(({ id, href, icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-icon"
                    aria-label={icon}
                  >
                    <i className={icon} />
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="cv-btn"
              onClick={() => setCvOpen(true)}
            >
              <i className="fa-regular fa-file-lines" aria-hidden="true" />
              <span>My CV</span>
            </button>
          </div>

          {/* ====================================================== */}
          {/* LAMA: Kanan (HANYA TAMPIL DI MOBILE/TABLET) */}
          {/* ====================================================== */}
          <div className="nav-right-mobile">
            <ul className="nav-icons">
              {socialLinks.map(({ id, href, icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-icon"
                    aria-label={icon}
                  >
                    <i className={icon} />
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="cv-btn"
              onClick={() => setCvOpen(true)}
            >
              <i className="fa-regular fa-file-lines" aria-hidden="true" />
              <span>My CV</span>
            </button>

            {/* Hamburger (mobile) */}
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="nav-links"
              onClick={toggle}
            >
              <i className="fas fa-bars" aria-hidden="true"></i>
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Render modal */}
      <CVModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  );
}
