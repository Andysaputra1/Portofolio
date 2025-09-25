// ProjectModal.tsx
import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { Project } from "../data/projects";
import { lockScroll, unlockScroll } from "../utils/scrollLock";

type Props = {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
};

export default function ProjectModal({ open, onClose, project }: Props) {
  if (!open || !project) return null;

  // 🔑 Tutup modal + pastikan scroll dibuka kembali
  const handleClose = useCallback(() => {
    try { unlockScroll(); } catch {}
    onClose();
  }, [onClose]);

  // lock saat mount, unlock saat unmount; ESC pakai handleClose
  useEffect(() => {
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      try { unlockScroll(); } catch {}
    };
  }, [handleClose]);

  const modal = (
    <div className="cv-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="cv-modal proj-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cv-header">
          <h3>{project.title}</h3>
          <button className="cv-close" aria-label="Close" onClick={handleClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cv-body">
          {project.image && <img className="proj-thumb" src={project.image} alt={project.title} />}
          <div className="proj-meta">
            <div className="proj-tag">{project.tag}</div>
            <div className="proj-stack">{project.stack}</div>
          </div>
          <p className="proj-desc">{project.description}</p>
        </div>

        <div className="cv-footer">
          <a className="cv-download" href={project.link} target="_blank" rel="noreferrer">
            <i className="fa-solid fa-up-right-from-square" /> Visit Project
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
