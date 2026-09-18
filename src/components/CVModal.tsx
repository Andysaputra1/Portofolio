import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { FiArrowUpRight, FiDownload, FiFileText, FiX } from "react-icons/fi";
import { lockScroll, unlockScroll } from "../utils/scrollLock";
import { usePortfolioData } from "../context/PortfolioDataContext";
import "./CVModal.css";
import PDFViewer from "./PDFViewer";

type Props = { open: boolean; onClose: () => void };

export default function CVModal({ open, onClose }: Props) {
  const { cvUrl, cvName } = usePortfolioData();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    lockScroll();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      unlockScroll();
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <dialog ref={dialogRef} className="cv-sheet" aria-labelledby="cv-sheet-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="cv-sheet-panel">
        <header className="cv-sheet-header">
          <div className="cv-sheet-heading">
            <span className="cv-sheet-icon"><FiFileText aria-hidden="true" /></span>
            <div><p className="cv-sheet-kicker">PROFILE / CURRICULUM VITAE</p><h2 id="cv-sheet-title">My CV<span>Andy Saputra</span></h2></div>
          </div>
          <button ref={closeRef} className="cv-sheet-close" type="button" aria-label="Close CV" onClick={onClose}><FiX aria-hidden="true" /></button>
        </header>
        <div className="cv-sheet-toolbar"><span>Experience, skills & selected work</span><span className="cv-sheet-format">PDF DOCUMENT</span></div>
        <div className="cv-sheet-preview"><PDFViewer url={cvUrl} title="Andy Saputra CV preview" /></div>
        <footer className="cv-sheet-footer">
          <p>Keep a copy for a closer look.<span>Preview unavailable? Open the PDF in a new tab.</span></p>
          <div className="cv-sheet-actions">
            <a className="cv-sheet-open" href={cvUrl} target="_blank" rel="noreferrer">Open PDF<FiArrowUpRight aria-hidden="true" /></a>
            <a className="cv-sheet-download" href={cvUrl} download={cvName}><FiDownload aria-hidden="true" />Download CV</a>
          </div>
        </footer>
      </div>
    </dialog>, document.body,
  );
}
