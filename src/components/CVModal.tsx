// CVModal.tsx
import { createPortal } from "react-dom";
import cvPdf from "../assets/Andy Saputra_CV.pdf";

type Props = { open: boolean; onClose: () => void };

export default function CVModal({ open, onClose }: Props) {
  if (!open) return null;

  // ❌ HAPUS useEffect yang set body.style.overflow di sini

  const modal = (
    <div className="cv-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="My CV">
      <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cv-header">
          <h3>My CV</h3>
          <button className="cv-close" aria-label="Close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cv-body">
          <iframe className="cv-frame" src={cvPdf} title="CV Preview" />
          <p className="cv-hint">
            Jika preview tidak tampil, silakan&nbsp;
            <a href={cvPdf} target="_blank" rel="noreferrer">buka CV di tab baru</a>.
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
