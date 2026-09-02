// src/components/Projects.tsx
import { useState, type CSSProperties } from "react";
import type { Project } from "../types/portfolio";
import { usePortfolioData } from "../context/PortfolioDataContext";
import ProjectModal from "./ProjectModal";
import useScrollReveal from "../hook/useScrollReveal.ts";

const si = (i: number) => ({ "--i": i } as CSSProperties & Record<"--i", number>);

export default function Projects() {
  const { projects } = usePortfolioData();
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
            <div className="proj-media">
              {p.image ? (
                <img className="proj-img" src={p.image} alt={p.title} loading="lazy" decoding="async" />
              ) : <div className="proj-img-placeholder"><i className="fa-regular fa-image" aria-hidden="true" /></div>}
              <span className="proj-number">{String(idx + 1).padStart(2, "0")}</span>
            </div>

            <div className="proj-body">
              <h3 className="proj-title">{p.title}</h3>
              <div className="proj-chip" aria-label="Project type/tag">{p.tag}</div>
              <div className="proj-stack-mini">{p.stack}</div>
              <p className="proj-summary">{p.description}</p>
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
