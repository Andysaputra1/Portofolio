// src/components/Projects.tsx
import { useState, type CSSProperties } from "react";
import { projects, type Project } from "../data/projects";
import ProjectModal from "./ProjectModal";
import useScrollReveal from "../hook/useScrollReveal.ts";

const si = (i: number) => ({ ["--i" as any]: i } as CSSProperties);

export default function Projects() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Project | null>(null);

  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const gridRef  = useScrollReveal<HTMLDivElement>();

  const openModal = (p: Project) => { setActive(p); setOpen(true); };
  const closeModal = () => { setOpen(false); setActive(null); };

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="section-title">
        <h2 id="projects-title" className="reveal" ref={titleRef}>
          My <span>Projects</span>
        </h2>
      </div>

      {/* grid diberi reveal-stagger agar kartu animasi berurutan */}
      <div className="proj-grid section-center reveal-stagger" ref={gridRef}>
        {projects.map((p, idx) => (
          <article key={p.id} className="proj-card reveal" style={si(idx)}>
            {p.image && (
              <img
                className="proj-img"
                src={p.image}
                alt={p.title}
                loading="lazy"
                decoding="async"
              />
            )}

            <div className="proj-body">
              <h3 className="proj-title">{p.title}</h3>
              <div className="proj-chip" aria-label="Project type/tag">{p.tag}</div>
              <div className="proj-stack-mini">{p.stack}</div>
            </div>

            <div className="proj-actions">
              <button
                type="button"
                className="btn proj-btn"
                onClick={() => openModal(p)}
                aria-haspopup="dialog"
                aria-controls="project-modal"
              >
                View Detail
              </button>

              <a
                className="btn proj-btn-alt"
                href={p.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${p.title}`}
              >
                Visit
              </a>
            </div>
          </article>
        ))}
      </div>

      <ProjectModal open={open} onClose={closeModal} project={active} />
    </section>
  );
}
