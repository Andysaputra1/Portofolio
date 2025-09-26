import { orgExperiences } from "../data/organization";

export default function OrganizationExperience() {
  return (
    <section id="experience" className="section exp-section">
      <div className="section-title">
        <h2>Experience</h2>
      </div>

      <div className="section-center">
        <div className="exp-card">

          <ul className="exp-list">
            {orgExperiences.map((x) => (
              <li key={x.id} className="exp-item">
                {/* Baris judul: role utama (jika ada) */}
                {x.role && <div className="exp-role">{x.role}</div>}
                <div className="exp-org">{x.org}</div>
                <div className="exp-period">{x.period}</div>

                {x.summary && <p className="exp-summary">{x.summary}</p>}

                {x.roles?.map((r) => (
                  <div key={r.title + (r.context || "")} className="exp-subrole">
                    <div className="exp-subtitle">
                      {r.title} {r.context && <span className="exp-context">{r.context}</span>}
                    </div>
                    <ul className="exp-bullets">
                      {r.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
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
