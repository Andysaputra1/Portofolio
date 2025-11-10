// Navbar.tsx (Sudah Diperbaiki)

import { useEffect, useRef, useState } from "react";
import logoImg from "../images/logo.png";
import { pageLinks, socialLinks } from "../data";
import CVModal from "./CVModal";

export default function Navbar() {
  const [open, setOpen] = useState(false); // menu mobile
  const [cvOpen, setCvOpen] = useState(false); // state untuk CV modal
  const linksRef = useRef<HTMLUListElement>(null);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);


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
      <nav className="navbar" role="navigation" aria-label="Main">
        <div className="nav-center">
          {/* Kiri: logo */}
          <div className="nav-header">
            <img
              src={logoImg}
              className="nav-logo"
              alt="logo"
              style={{
                height: "2.25rem",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,.4))",
              }}
            />
          </div>

          {/* Tengah (mobile: dropdown; desktop: inline) */}
          <ul
            id="nav-links"
            ref={linksRef}
            className={`nav-links ${open ? "is-open" : ""}`}
            style={{ maxHeight: maxH }}
          >
            {pageLinks.map((link) => (
              <li key={link.id}>
                <a href={link.href} className="nav-link" onClick={close}>
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