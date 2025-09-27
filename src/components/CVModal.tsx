// src/components/CVModal.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// PENTING: entry khusus Vite — tidak perlu set pdfjs worker
import cvPdfUrl from "../assets/AndySaputra_CV.pdf";
import { lockScroll, unlockScroll } from "../utils/scrollLock";
import { Document, Page, pdfjs } from "react-pdf";

// Set worker untuk Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type Props = { open: boolean; onClose: () => void };

export default function CVModal({ open, onClose }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [wrapWidth, setWrapWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    try { unlockScroll(); } catch {}
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    lockScroll();

    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setWrapWidth(wrapRef.current.clientWidth);
    });
    if (wrapRef.current) {
      setWrapWidth(wrapRef.current.clientWidth);
      ro.observe(wrapRef.current);
    }

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      ro.disconnect();
      try { unlockScroll(); } catch {}
    };
  }, [open]);

  if (!open) return null;

  const modal = (
    <div className="cv-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-label="My CV">
      <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cv-header">
          <h3>My CV</h3>
          <button className="cv-close" aria-label="Close" onClick={handleClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cv-body">
          {!err ? (
            <div className="cv-scroll" ref={wrapRef}>
              <Document
                file={cvPdfUrl}
                loading={<div className="cv-loading">Loading CV…</div>}
                onLoadSuccess={({ numPages }) => { setNumPages(numPages); setErr(null); }}
                onLoadError={(e) => { console.error(e); setErr("Failed to load PDF."); }}
              >
                <div className="cv-pages">
                  {Array.from({ length: numPages }, (_, i) => (
                    <Page
                      key={i + 1}
                      pageNumber={i + 1}
                      width={wrapWidth ? Math.min(wrapWidth, 900) : undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="cv-page"
                    />
                  ))}
                </div>
              </Document>
            </div>
          ) : (
            // Fallback jika PDF viewer gagal
            <div>
              <div className="cv-loading">Preview bermasalah. Silakan buka di tab baru atau download.</div>
              <iframe className="cv-frame" src={cvPdfUrl} title="CV Preview (fallback)" />
            </div>
          )}

          <p className="cv-hint">
            Preview bermasalah?&nbsp;
            <a href={cvPdfUrl} target="_blank" rel="noreferrer">Buka di tab baru</a>.
          </p>
        </div>

        <div className="cv-footer">
          <a className="cv-download" href={cvPdfUrl} download>
            <i className="fa-solid fa-download" /> Download CV
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
