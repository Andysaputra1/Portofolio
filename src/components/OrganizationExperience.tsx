// src/components/OrganizationExperience.tsx
import { usePortfolioData } from "../context/PortfolioDataContext";
import useScrollReveal from "../hook/useScrollReveal.ts";
import type { CSSProperties } from "react";
import type { OrgExp } from "../types/portfolio";

const si = (i: number) => ({ "--i": i } as CSSProperties & Record<"--i", number>);

function ExperiencePhoto({ experience }: { experience: OrgExp }) {
  if (!experience.image) return null;
  return (
    <figure className={`exp-photo${experience.imageLayout === 'landscape' ? " exp-photo-freshmen" : ""}`}>
      <div className="exp-photo-frame">
        <img src={experience.image} alt={experience.imageCaption || `${experience.role || experience.org} experience`} loading="lazy" decoding="async" />
      </div>
      {experience.imageCaption && <figcaption>{experience.imageCaption}</figcaption>}
    </figure>
  );
}

export default function OrganizationExperience() {
  const { organizations } = usePortfolioData();
  // reveal refs
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const cardRef  = useScrollReveal<HTMLDivElement>();
  const listRef  = useScrollReveal<HTMLUListElement>(); // untuk stagger anak-anaknya

  return (
    <section id="experience" className="section exp-section">
      <div className="section-title">
        <p className="section-kicker">03 / ALONG THE WAY</p>
        <h2 className="reveal" ref={titleRef}>Learning by <span>doing.</span></h2>
        <p className="section-description">The teams, experiences, and responsibilities that shaped how I work.</p>
      </div>

      <div className="section-center">
        {/* kartu dibikin reveal juga */}
        <div className="exp-card reveal" ref={cardRef}>
          {/* pakai reveal-stagger di UL supaya anak-anaknya animasi berurutan */}
          <ul className="exp-list reveal-stagger" ref={listRef}>
            {organizations.map((x, idx) => (
              // tiap item ikut delay berdasarkan --i
              <li key={x.id} className="exp-item" style={si(idx)}>
                <div className="exp-meta">
                  {x.role && <div className="exp-role">{x.role}</div>}
                  <div className="exp-org">{x.org}</div>
                  {x.location && <div className="exp-location">{x.location}</div>}
                  <div className="exp-period">{x.period}</div>
                  <ExperiencePhoto experience={x} />
                </div>
                <div className="exp-details">
                  {x.summary && <p className="exp-summary">{x.summary}</p>}
                  {x.roles?.map((r, i2) => (
                    <div key={r.title + (r.context || "")} className="exp-subrole" style={si(idx + i2 + 1)}>
                      <div className="exp-subtitle">
                        {r.title} {r.context && <span className="exp-context">{r.context}</span>}
                      </div>
                      {r.bullets.length > 0 && <ul className="exp-bullets">{r.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
