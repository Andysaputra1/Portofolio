import { useState } from "react";
import type { ExperienceProject } from "../types/portfolio";
import ArrowIcon from "./ArrowIcon";

export default function ExperienceProjects({ projects, organization }: { projects: ExperienceProject[]; organization: string }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const index = Math.max(0, projects.findIndex((project) => project.id === selectedId));
  const active = projects[index];
  if (!active) return null;
  const move = (offset: number) => setSelectedId(projects[(index + offset + projects.length) % projects.length].id);

  return <section className="exp-showcase" aria-label={organization + ' selected projects'} aria-roledescription="carousel">
    <p className="exp-showcase-label">Selected projects</p>
    <div className="exp-showcase-nav">
      <div className="exp-project-picker" aria-label="Choose a project">
        {projects.map((project) => <button type="button" key={project.id} aria-pressed={project.id === active.id} onClick={() => setSelectedId(project.id)}>{project.title}</button>)}
      </div>
    </div>
    <div className="exp-project-layout">
      <div className="exp-project-preview">
        <div className="exp-project-media">
          {active.image ? <img src={active.image} alt={active.title + ' — ' + active.subtitle} loading="lazy" decoding="async" /> : <span className="exp-project-placeholder">{active.title}</span>}
          {projects.length > 1 && <div className="exp-project-controls">
            <button type="button" onClick={() => move(-1)} aria-label={'Previous project at ' + organization} title="Previous project"><ArrowIcon direction="left" /></button>
            <button type="button" onClick={() => move(1)} aria-label={'Next project at ' + organization} title="Next project"><ArrowIcon direction="right" /></button>
          </div>}
        </div>
        {projects.length > 1 && <p className="exp-project-hint"><span>Explore projects with the arrows</span><span>{index + 1} / {projects.length}</span></p>}
      </div>
      <div className="exp-project-slides" aria-live="polite" aria-atomic="true">
        {projects.map((project, slideIndex) => <article key={project.id} className="exp-project-slide" data-active={project.id === active.id} aria-hidden={project.id !== active.id} aria-roledescription="slide" aria-label={(slideIndex + 1) + ' of ' + projects.length + ': ' + project.title}>
          <div className="exp-project-body">
            <h3>{project.title}</h3>
            <p className="exp-project-subtitle">{project.subtitle}</p>
            <p className="exp-project-description">{project.description}</p>
            <ul className="exp-tech-tags" aria-label="Project technologies">{project.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
