import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiArrowUpRight, FiGithub, FiX } from "react-icons/fi";
import type { Project } from "../types/portfolio";
import { lockScroll, unlockScroll } from "../utils/scrollLock";
import "./ProjectModal.css";

type Props = { open: boolean; onClose: () => void; project?: Project | null };

export default function ProjectModal({ open, onClose, project }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !project || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    lockScroll();
    titleRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      unlockScroll();
      trigger?.focus({ preventScroll: true });
    };
  }, [open, project]);

  if (!open || !project) return null;
  const isRepository = project.link.startsWith("https://github.com/");
  const technologies = project.stack.split(/\s*[·•]\s*/).filter(Boolean);

  return createPortal(
    <dialog id="project-modal" ref={dialogRef} className="project-dialog" aria-labelledby="project-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="project-dialog-panel">
        <header className="project-dialog-header">
          <div>
            <p className="project-dialog-eyebrow"><span /> SELECTED WORK / PROJECT DETAILS</p>
            <h2 id="project-dialog-title" ref={titleRef} tabIndex={-1}>{project.title}</h2>
            <div className="project-dialog-badges"><span className="project-dialog-category">{project.tag}</span>{project.status && <span className="proj-status">{project.status}</span>}</div>
          </div>
          <button className="project-dialog-close" type="button" onClick={onClose} aria-label="Close project details"><FiX aria-hidden="true" /></button>
        </header>

        <div className="project-dialog-body">
          {project.ai && (
            <section className="project-ai-details" aria-label="AI research highlights">
              <p className="project-ai-kicker">AI / TECHNICAL HIGHLIGHTS</p>
              <dl>
                <div><dt>Research focus</dt><dd>{project.ai.focus}</dd></div>
                <div><dt>Models & methods</dt><dd>{project.ai.models}</dd></div>
                <div className="project-ai-wide"><dt>Approach</dt><dd>{project.ai.approach}</dd></div>
                <div className="project-ai-wide project-ai-output"><dt>Result / output</dt><dd>{project.ai.output}</dd></div>
                <div className="project-ai-wide project-ai-evaluation"><dt>Evaluation & current limits</dt><dd>{project.ai.evaluation}</dd></div>
              </dl>
            </section>
          )}
          {project.image && <figure className="project-dialog-media"><div className="project-dialog-preview-bar" aria-hidden="true"><span className="project-dialog-window-dots"><i /><i /><i /></span><span>PROJECT PREVIEW</span><FiArrowUpRight /></div><img src={project.image} alt={`${project.title} interface preview`} /></figure>}
          <div className="project-dialog-layout">
            <section className="project-dialog-overview"><h3><span>01</span> About the project</h3>{project.description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>
            <aside className="project-dialog-facts" aria-label="Project information">
              {project.role && <section className="project-dialog-fact"><h3>My role</h3><p>{project.role}</p></section>}
              <section className="project-dialog-fact"><h3>Built with</h3><ul className="project-dialog-technologies">{technologies.map((technology, index) => <li key={`${technology}-${index}`}>{technology}</li>)}</ul></section>
            </aside>
          </div>
        </div>

        <footer className="project-dialog-footer">
          <span>{isRepository ? "Explore the code and documentation" : "Take a closer look at the project"}</span>
          <a className="project-dialog-link" href={project.link} target="_blank" rel="noreferrer">{isRepository ? <FiGithub aria-hidden="true" /> : <FiArrowUpRight aria-hidden="true" />}{isRepository ? "View repository" : "Visit project"}<FiArrowUpRight className="project-dialog-link-arrow" aria-hidden="true" /></a>
        </footer>
      </div>
    </dialog>,
    document.body,
  );
}
