import meImg from "../images/Photo1.jpg";
import useScrollReveal from "../hook/useScrollReveal.ts";
import PixelBuddy from "./PixelBuddy";

export default function About() {
  const copyRef = useScrollReveal<HTMLDivElement>();
  const photoRef = useScrollReveal<HTMLDivElement>();
  return (
    <section id="about" className="intro section" aria-labelledby="about-title">
      <div className="intro-grid">
        <div className="intro-copy reveal" ref={copyRef}>
          <p className="section-kicker">01 / A LITTLE ABOUT ME</p>
          <h2 id="about-title" className="intro-title">Curious mind.<br /><span>Purposeful work.</span></h2>
          <p className="intro-lead">Hi, I'm Andy. A computer science student who sees possibilities beyond the code.</p>
          <p className="intro-text">I study Intelligent Systems at BINUS University, exploring how technology can solve real problems. My interests bring together web development, artificial intelligence, and thoughtful digital experiences.</p>
          <p className="intro-text">From building projects to broadcasting and leading teams, I love connecting ideas and people to make something meaningful.</p>
          <div className="about-facts"><div><span>STUDYING AT</span><strong>BINUS University</strong></div><div><span>MY FOCUS</span><strong>Intelligent Systems</strong></div></div>
          <a href="#experience" className="text-link">A little more about my journey <span aria-hidden="true">↗</span></a>
          <PixelBuddy />
        </div>
        <div className="intro-photo-card reveal" ref={photoRef}>
          <img className="intro-photo" src={meImg} alt="Andy Saputra" loading="lazy" />
          <div className="photo-caption"><span>THE PERSON BEHIND THE PIXELS</span><strong>Always learning.<br />Always building.</strong></div>
          <span className="photo-corner" aria-hidden="true">↗</span>
        </div>
      </div>
    </section>
  );
}
