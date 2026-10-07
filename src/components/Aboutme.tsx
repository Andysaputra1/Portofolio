import meImg from "../images/Photo1.webp";
import useScrollReveal from "../hook/useScrollReveal.ts";
import PixelBuddy from "./PixelBuddy";
import ArrowIcon from "./ArrowIcon";
import SectionHead from "./SectionHead";

const facts = [
  { label: "Studying", value: "Computer Science (Intelligent Systems), BINUS University, 2023–2027" },
  { label: "Now", value: "Application developer intern, Polytron" },
  { label: "Also", value: "Freelance full-stack developer, Qreed AI" },
  { label: "Based in", value: "Jakarta, Indonesia" },
  { label: "Speaks", value: "Indonesian, English, Mandarin (basic), Teochew" },
];

export default function About() {
  const copyRef = useScrollReveal<HTMLDivElement>();
  const photoRef = useScrollReveal<HTMLElement>();
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead label="about" title="About me" titleId="about-title" aside={<PixelBuddy />}>
          The short version, plus the facts people usually ask for.
        </SectionHead>
        <div className="about-grid">
          <figure className="about-photo reveal" ref={photoRef}>
            <div className="about-photo-frame">
              <img src={meImg} alt="Andy Saputra smiling at a campus event" loading="lazy" />
            </div>
            <figcaption>The non-pixel version.</figcaption>
          </figure>
          <div className="about-copy reveal-stagger" ref={copyRef}>
            <p className="about-lead">I'm Andy. I like work that needs both halves: a model that holds up, and an app people actually want to use.</p>
            <p>I'm in my final year of Computer Science at BINUS University, majoring in Intelligent Systems. My thesis, <em>Silent Terror</em>, is a strategy game whose characters run on a hybrid of NLU, fuzzy logic and an LLM.</p>
            <p>Before most of the code, I edited videos and ran technical crews at BINUS TV Club, led freshmen, and directed school events in Batam. Getting people and ideas to meet is still my favorite part of a project.</p>
            <dl className="spec-list">
              {facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
            <a href="#experience" className="text-link">See where I've worked <ArrowIcon direction="down" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
