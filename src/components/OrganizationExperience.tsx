// src/components/OrganizationExperience.tsx
import { orgExperiences } from "../data/organization";
import useScrollReveal from "../hook/useScrollReveal.ts";
import type { CSSProperties } from "react";

const si = (i: number) => ({ ["--i" as any]: i } as CSSProperties);

export default function OrganizationExperience() {
  // reveal refs
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const cardRef  = useScrollReveal<HTMLDivElement>();
  const listRef  = useScrollReveal<HTMLUListElement>(); // untuk stagger anak-anaknya

  return (
    <section id="experience" className="section exp-section">
      <div className="section-title">
        <h2 className="reveal" ref={titleRef}>Experience</h2>
      </div>

      <div className="section-center">
        {/* kartu dibikin reveal juga */}
        <div className="exp-card reveal" ref={cardRef}>
          {/* pakai reveal-stagger di UL supaya anak-anaknya animasi berurutan */}
          <ul className="exp-list reveal-stagger" ref={listRef}>
            {orgExperiences.map((x, idx) => (
              // tiap item ikut delay berdasarkan --i
              <li key={x.id} className="exp-item" style={si(idx)}>
                {/* Baris judul */}
                {x.role && <div className="exp-role">{x.role}</div>}
                <div className="exp-org">{x.org}</div>
                <div className="exp-period">{x.period}</div>

                {x.summary && <p className="exp-summary">{x.summary}</p>}

                {x.roles?.map((r, i2) => (
                  <div key={r.title + (r.context || "")} className="exp-subrole" style={si(idx + i2 + 1)}>
                    <div className="exp-subtitle">
                      {r.title} {r.context && <span className="exp-context">{r.context}</span>}
                    </div>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
