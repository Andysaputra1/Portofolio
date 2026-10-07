// src/components/Projects.tsx
import { useState } from "react";
import { listText, projectCategories, type Project } from "../types/portfolio";
import { usePortfolioData } from "../context/PortfolioDataContext";
import DinoBuilder from "./DinoBuilder";
import ProjectModal from "./ProjectModal";
import ArrowIcon from "./ArrowIcon";
import SectionHead from "./SectionHead";

const ALL = "All";

export default function Projects() {
  const { projects } = usePortfolioData();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState(ALL);
  const filters = [ALL, ...new Set(projects.flatMap(projectCategories))];
  const visibleProjects = projects.filter((p) => filter === ALL || projectCategories(p).includes(filter));

  const openModal = (p: Project) => { setActive(p); setOpen(true); };
  const closeModal = () => { setOpen(false); setActive(null); };

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead title="Selected projects" titleId="projects-title" aside={<DinoBuilder />}>
          {projects.length} projects, from deep-learning experiments to web apps people use. Open one for the method, the stack and what came out of it.
        </SectionHead>

        <div className="project-filters" role="group" aria-label="Filter projects by category">
          {filters.map((tag) => {
            const count = tag === ALL ? projects.length : projects.filter((p) => projectCategories(p).includes(tag)).length;
            return <button key={tag} type="button" aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag}<span>{count}</span></button>;
          })}
        </div>

        <div className="proj-grid">
          {visibleProjects.map((p) => {
            const isRepository = p.link.startsWith("https://github.com/");
            return (
              <article key={p.id} className="proj-card">
                <div className="proj-media">
                  {p.image ? (
                    <img className="proj-img" src={p.image} alt="" loading="lazy" decoding="async" />
                  ) : <div className="proj-img-placeholder"><i className="fa-regular fa-image" aria-hidden="true" /></div>}
                  {p.status && <span className="proj-status">{p.status}</span>}
                </div>

                <div className="proj-body">
                  <p className="proj-categories">{projectCategories(p).join(", ")}</p>
                  <h3 className="proj-title">{p.title}</h3>
                  <p className="proj-summary">{p.description}</p>
                  <p className="proj-method"><span>{p.ai ? "Method" : "Stack"}</span>{listText(p.ai?.models ?? p.stack)}</p>
                </div>

                <div className="proj-actions">
                  {/* The details button stretches over the whole card, so any click on it opens the dialog. */}
                  <button
                    type="button"
                    className="proj-open"
                    onClick={() => openModal(p)}
                    aria-haspopup="dialog"
                    aria-controls="project-modal"
                  >
                    Details<span className="sr-only">: {p.title}</span>
                  </button>
                  <a
                    className="proj-link"
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${isRepository ? "Source code" : "Live website"}: ${p.title} (opens in a new tab)`}
                  >
                    {isRepository ? "Code" : "Live site"} <ArrowIcon />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <ProjectModal open={open} onClose={closeModal} project={active} />
    </section>
  );
}
