import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import type { ExperienceProject } from "../types/portfolio";
import ArrowIcon from "./ArrowIcon";

// Desktop pins the intro and showcase together and lets page scroll step through projects;
// smaller screens, or windows too short to fit the pinned block, keep the tap carousel.
const DESKTOP_QUERY = "(min-width: 901px)";
const FALLBACK_ACCENT = "#d4d4d4";
const accentStyle = (accent?: string) => ({ "--project-accent": accent ?? FALLBACK_ACCENT } as CSSProperties);
// Below the pinned block, the next experience peeks into view by at least this much (and at most PEEK_MAX).
const PEEK_MIN = 64;
const PEEK_MAX = 240;
// The block pins just below the fixed navbar; on short windows it pins higher, letting the summary slide
// under the navbar, as long as the project box itself stays below NAV_BOTTOM.
const PIN_TOP = 112;
const NAV_BOTTOM = 100;

function usePinnedLayout(stageRef: RefObject<HTMLDivElement | null>) {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const media = window.matchMedia(DESKTOP_QUERY);
    const item = stage.closest<HTMLElement>(".exp-item") ?? stage;
    const update = () => {
      const panel = stage.querySelector<HTMLElement>(".exp-showcase");
      const panelOffset = panel ? panel.getBoundingClientRect().top - stage.getBoundingClientRect().top : 0;
      const top = Math.min(PIN_TOP, window.innerHeight - PEEK_MIN - stage.offsetHeight);
      item.style.setProperty("--pin-top", top + "px");
      setPinned(media.matches && top + panelOffset >= NAV_BOTTOM);
    };
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    media.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      item.style.removeProperty("--pin-top");
    };
  }, [stageRef]);
  return pinned;
}

export default function ExperienceProjects({ projects, organization, intro }: { projects: ExperienceProject[]; organization: string; intro?: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinned = usePinnedLayout(stageRef) && projects.length > 1;
  const [index, setIndex] = useState(0);

  // Scroll distance the sticky stage travels, and where the track starts relative to the pin line.
  const measure = useCallback(() => {
    const track = trackRef.current, stage = stageRef.current;
    if (!track || !stage) return null;
    const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
    const distance = track.offsetHeight - stage.offsetHeight;
    return distance > 0 ? { track, stage, stickyTop, distance, scrolled: stickyTop - track.getBoundingClientRect().top } : null;
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const item = trackRef.current?.closest<HTMLElement>(".exp-item");
    const following = item?.nextElementSibling instanceof HTMLElement ? item.nextElementSibling : null;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const m = measure();
      if (!m) return;
      const progress = Math.min(Math.max(m.scrolled / m.distance, 0), 0.9999) * projects.length;
      const next = Math.floor(progress);
      m.track.style.setProperty("--segment-progress", String(progress - next));
      setIndex(next);
      // The left column stays exactly as tall as the stage so both release together.
      item?.style.setProperty("--pin-stage-h", m.stage.offsetHeight + "px");
      // Once pinned, pull the next experience up into the space below the stage so the page reads as continuing.
      if (following) {
        const peek = Math.min(window.innerHeight - m.stickyTop - m.stage.offsetHeight - 16, PEEK_MAX);
        following.style.setProperty("--peek-offset", peek - following.offsetHeight + "px");
        following.dataset.peek = String(m.scrolled >= 0);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };
    sync();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      item?.style.removeProperty("--pin-stage-h");
      if (following) delete following.dataset.peek;
    };
  }, [pinned, projects.length, measure]);

  const active = projects[index] ?? projects[0];
  if (!active) return null;

  const go = (target: number) => {
    const m = pinned ? measure() : null;
    if (!m) { setIndex((target + projects.length) % projects.length); return; }
    const clamped = Math.min(Math.max(target, 0), projects.length - 1);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Land just inside the segment so the picked project is the one shown.
    const top = window.scrollY - m.scrolled + m.distance * ((clamped + 0.08) / projects.length);
    window.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
  };

  return <div className="exp-showcase-track" ref={trackRef} data-pinned={pinned} style={{ ...accentStyle(active.accent), "--project-count": projects.length } as CSSProperties}>
    <div className="exp-showcase-stage" ref={stageRef}>
      {intro}
      <section className="exp-showcase" aria-label={organization + ' selected projects'} aria-roledescription="carousel">
        <div className="exp-showcase-panel">
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
                  <button type="button" onClick={() => go(index - 1)} disabled={pinned && index === 0} aria-label={'Previous project at ' + organization} title="Previous project"><ArrowIcon direction="left" /></button>
                  <button type="button" onClick={() => go(index + 1)} disabled={pinned && index === projects.length - 1} aria-label={'Next project at ' + organization} title="Next project"><ArrowIcon direction="right" /></button>
                </div>}
              </div>
              {projects.length > 1 && <p className="exp-project-hint"><span>{!pinned ? "Explore projects with the arrows" : index < projects.length - 1 ? "Keep scrolling to see the next project" : "Last project. Keep scrolling to continue"}</span><span>{index + 1} / {projects.length}</span></p>}
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
      </section>
    </div>
  </div>;
}
