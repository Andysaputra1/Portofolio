import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { ExperienceProject } from "../types/portfolio";
import ArrowIcon from "./ArrowIcon";

// On desktop the page scrolls normally and the box steps through its projects as it rises through the
// viewport; smaller screens keep the tap carousel.
const SCROLL_QUERY = "(min-width: 901px)";
// Stepping starts once this share of the box is visible and finishes when its top reaches END_TOP of the
// viewport, so the last project is already showing before the box gets to the top of the screen.
const START_VISIBLE = 0.35;
const END_TOP = 0.2;
const NAV_BOTTOM = 112;
const FALLBACK_ACCENT = "#d4d4d4";
const accentStyle = (accent?: string) => ({ "--project-accent": accent ?? FALLBACK_ACCENT } as CSSProperties);

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export default function ExperienceProjects({ projects, organization }: { projects: ExperienceProject[]; organization: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollDriven = useMediaQuery(SCROLL_QUERY) && projects.length > 1;
  const [index, setIndex] = useState(0);

  // Viewport positions of the box's top where stepping starts and ends.
  const measure = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return null;
    const rect = panel.getBoundingClientRect();
    const start = window.innerHeight - rect.height * START_VISIBLE;
    const end = Math.max(window.innerHeight * END_TOP, NAV_BOTTOM);
    return start > end ? { top: rect.top, start, end } : null;
  }, []);

  useEffect(() => {
    if (!scrollDriven) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const m = measure();
      if (!m) return;
      const progress = Math.min(Math.max((m.start - m.top) / (m.start - m.end), 0), 0.9999) * projects.length;
      const next = Math.floor(progress);
      sectionRef.current?.style.setProperty("--segment-progress", String(progress - next));
      setIndex(next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };
    sync();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [scrollDriven, projects.length, measure]);

  const active = projects[index] ?? projects[0];
  if (!active) return null;

  const go = (target: number) => {
    const m = scrollDriven ? measure() : null;
    if (!m) { setIndex((target + projects.length) % projects.length); return; }
    const clamped = Math.min(Math.max(target, 0), projects.length - 1);
    // Scroll until the box sits in the middle of that project's stretch.
    const top = m.start - (m.start - m.end) * ((clamped + 0.5) / projects.length);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: window.scrollY + m.top - top, behavior: reduced ? "instant" : "smooth" });
  };

  return <section className="exp-showcase" ref={sectionRef} data-scroll={scrollDriven} style={{ ...accentStyle(active.accent), "--project-count": projects.length } as CSSProperties} aria-label={organization + ' selected projects'} aria-roledescription="carousel">
    <div className="exp-showcase-panel" ref={panelRef}>
      <div className="exp-showcase-nav">
        <p className="exp-showcase-label">Selected projects</p>
        <div className="exp-project-picker" aria-label="Choose a project">
          {projects.map((project, i) => <button type="button" key={project.id} style={accentStyle(project.accent)} aria-pressed={i === index} data-state={i < index ? "done" : i === index ? "active" : "upcoming"} onClick={() => go(i)}>
            <span className="exp-project-picker-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            {project.title}
            <span className="exp-project-picker-bar" aria-hidden="true"><i /></span>
          </button>)}
        </div>
      </div>
      <div className="exp-project-layout">
        <div className="exp-project-preview">
          <div className="exp-project-media">
            {projects.map((project, i) => project.image
              ? <img key={project.id} src={project.image} alt={i === index ? project.title + ' — ' + project.subtitle : ""} aria-hidden={i !== index} data-active={i === index} loading="lazy" decoding="async" />
              : <span key={project.id} className="exp-project-placeholder" data-active={i === index} aria-hidden={i !== index}>{project.title}</span>)}
            {projects.length > 1 && <div className="exp-project-controls">
              <button type="button" onClick={() => go(index - 1)} disabled={scrollDriven && index === 0} aria-label={'Previous project at ' + organization} title="Previous project"><ArrowIcon direction="left" /></button>
              <button type="button" onClick={() => go(index + 1)} disabled={scrollDriven && index === projects.length - 1} aria-label={'Next project at ' + organization} title="Next project"><ArrowIcon direction="right" /></button>
            </div>}
          </div>
          {projects.length > 1 && <p className="exp-project-hint"><span>{!scrollDriven ? "Explore projects with the arrows" : index < projects.length - 1 ? "Keep scrolling to see the next project" : "Last project"}</span><span>{index + 1} / {projects.length}</span></p>}
        </div>
        <div className="exp-project-slides" aria-live="polite" aria-atomic="true">
          {projects.map((project, slideIndex) => <article key={project.id} className="exp-project-slide" data-active={slideIndex === index} aria-hidden={slideIndex !== index} aria-roledescription="slide" aria-label={(slideIndex + 1) + ' of ' + projects.length + ': ' + project.title}>
            <div className="exp-project-body">
              <h3>{project.title}</h3>
              <p className="exp-project-subtitle">{project.subtitle}</p>
              <p className="exp-project-description">{project.description}</p>
              <ul className="exp-tech-tags" aria-label="Project technologies">{project.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>
            </div>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}
