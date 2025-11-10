// CVModal.tsx (Sudah diperbaiki)

import { createPortal } from "react-dom";
import { useEffect } from "react"; // 1. Import useEffect
import cvPdf from "../assets/Andy Saputra_CV.pdf";

type Props = { open: boolean; onClose: () => void };

export default function CVModal({ open, onClose }: Props) {
  // 2. Tambahkan useEffect ini
  useEffect(() => {
    if (open) {
      // Saat modal terbuka, tambahkan class ke body
      document.body.classList.add("modal-open");
    } else {
      // Saat modal tertutup, hapus class dari body
      document.body.classList.remove("modal-open");
    }

    // Cleanup function: pastikan class dihapus jika komponen di-unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [open]); // Efek ini bergantung pada prop 'open'

  if (!open) return null;

  const modal = (
    <div
      className="cv-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="My CV"
    >
      <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
        {/* ... sisa kode modal Anda (header, body, footer) ... */}
        <div className="cv-header">
          <h3>My CV</h3>
          <button className="cv-close" aria-label="Close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cv-body">
          <iframe className="cv-frame" src={cvPdf} title="CV Preview" />
          <p className="cv-hint">
            Jika preview tidak tampil atau hanya 1 halaman, silakan&nbsp;
            <a href={cvPdf} target="_blank" rel="noreferrer">
              buka CV di tab baru
            </a>
            .
          </p>
        </div>

        <div className="cv-footer">
          <a className="cv-download" href={cvPdf} download>
            <i className="fa-solid fa-download" /> Download CV
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}