import meImg from "../images/Photo1.webp";
import PixelBuddy from "./PixelBuddy";
import SectionHead from "./SectionHead";

const facts = [
  { label: "Now", value: ["App Developer Intern, Polytron", "Freelance Full-Stack Developer, Qreed AI"] },
  { label: "Studying", value: ["Computer Science, BINUS University"] },
  { label: "Focus", value: ["Web development and AI"] },
];

// On desktop the whole section fits one screen: the photo fills the left column and the
// heading, copy and facts share the right one.
export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <SectionHead title="About me" titleId="about-title" aside={<PixelBuddy />} />
        <figure className="about-photo">
          <div className="about-photo-frame">
            <img src={meImg} alt="Andy Saputra smiling at a campus event" loading="lazy" />
          </div>
          <figcaption>The non-pixel version.</figcaption>
        </figure>
        <div className="about-copy">
          <p className="about-lead">Hi, I'm Andy. I see possibilities beyond the code.</p>
          <p>I'm a Computer Science student at BINUS University, majoring in Intelligent Systems. I like exploring how technology can solve real problems, mixing web development, AI and things that are simply nice to use.</p>
          <p>From building projects to broadcasting at BINUS TV Club and leading teams, I love connecting ideas and people to make something meaningful.</p>
          <dl className="spec-list">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value.map((line) => <span key={line}>{line}</span>)}</dd>
              </div>
            ))}
          </dl>
          <a href="#experience" className="text-link">See where I've worked</a>
        </div>
      </div>
    </section>
  );
}
