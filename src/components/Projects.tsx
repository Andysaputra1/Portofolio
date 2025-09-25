// src/components/Projects.tsx
import { useState } from "react";
import { projects, type Project } from "../data/projects";
import ProjectModal from "./ProjectModal";

export default function Projects() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Project | null>(null);

  const openModal = (p: Project) => {
    setActive(p);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setActive(null);
  };

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="section-title">
        <h2 id="projects-title">
          My <span>Projects</span>
        </h2>
      </div>

      <div className="proj-grid section-center">
        {projects.map((p) => (
          <article key={p.id} className="proj-card">
            {/* thumbnail (opsional) */}
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
              <div className="proj-chip" aria-label="Project type/tag">
                {p.tag}
              </div>
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

      {/* Modal detail project */}
      <ProjectModal
        open={open}
        onClose={closeModal}
        project={active}
      />
    </section>
  );
}
