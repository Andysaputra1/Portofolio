import meImg from "../images/Photo1.webp";
import PixelBuddy from "./PixelBuddy";
import SectionHead from "./SectionHead";
import { parallax, reveal } from "../utils/scrollMotion";

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
        <figure ref={reveal} data-reveal="up" className="about-photo">
          <div className="about-photo-frame">
            <img ref={parallax} data-parallax src={meImg} alt="Andy Saputra smiling at a campus event" loading="lazy" />
          </div>
          <figcaption>The non-pixel version.</figcaption>
        </figure>
        <div className="about-copy">
          <p ref={reveal} data-reveal="up" className="about-lead">Hi, I'm Andy. I see possibilities beyond the code.</p>
          <p ref={reveal} data-reveal="up">I'm a Computer Science student at BINUS University, majoring in <strong className="text-emphasis">Intelligent Systems</strong>. I like exploring how technology can solve real problems, mixing <strong className="text-emphasis">web development, AI</strong> and things that are simply nice to use.</p>
          <p ref={reveal} data-reveal="up">From building projects to broadcasting at BINUS TV Club and <strong className="text-emphasis">leading teams</strong>, I love connecting ideas and people to make something meaningful.</p>
          <dl ref={reveal} data-reveal="up" className="spec-list">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value.map((line) => <span key={line}>{line}</span>)}</dd>
              </div>
            ))}
          </dl>
          <a ref={reveal} data-reveal="up" href="#experience" className="text-link">See where I've worked</a>
        </div>
      </div>
    </section>
  );
}
