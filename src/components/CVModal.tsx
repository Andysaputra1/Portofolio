import { createPortal } from "react-dom";
import { useEffect, useCallback } from "react";
import { lockScroll, unlockScroll } from "../utils/scrollLock";
import { usePortfolioData } from "../context/PortfolioDataContext";

type Props = { open: boolean; onClose: () => void };

export default function CVModal({ open, onClose }: Props) {
  const { cvUrl, cvName } = usePortfolioData();
  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && handleClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      unlockScroll();
    };
  }, [handleClose, open]);

  if (!open) return null;

  const modal = (
    <div
      className="cv-backdrop"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="My CV"
    >
      <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
        {/* ... sisa kode modal Anda (header, body, footer) ... */}
        <div className="cv-header">
          <h3>My CV</h3>
          <button className="cv-close" aria-label="Close" onClick={handleClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cv-body">
          <iframe className="cv-frame" src={cvUrl} title="CV Preview" />
          <p className="cv-hint">
            Jika preview tidak tampil atau hanya 1 halaman, silakan&nbsp;
            <a href={cvUrl} target="_blank" rel="noreferrer">
              buka CV di tab baru.
            </a>
            .
          </p>
        </div>

        <div className="cv-footer">
          <a className="cv-download" href={cvUrl} download={cvName}>
            <i className="fa-solid fa-download" /> Download CV
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
