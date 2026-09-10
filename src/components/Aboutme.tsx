import meImg from "../images/Photo1.jpg";
import useScrollReveal from "../hook/useScrollReveal.ts";
import PixelBuddy from "./PixelBuddy";

export default function About() {
  const copyRef = useScrollReveal<HTMLDivElement>();
  const photoRef = useScrollReveal<HTMLDivElement>();
  return (
    <section id="about" className="intro section" aria-labelledby="about-title">
      <div className="intro-grid">
        <div className="intro-copy reveal-stagger" ref={copyRef}>
          <p className="section-kicker">01 / A LITTLE ABOUT ME</p>
          <h2 id="about-title" className="intro-title">Curious mind.<br /><span>Purposeful work.</span></h2>
          <p className="intro-lead">Hi, I'm Andy. I see possibilities beyond the code.</p>
          <p className="intro-text">I’m a Computer Science student at BINUS University, specializing in Intelligent Systems. I explore how technology can solve real problems, combining web development, artificial intelligence, and thoughtful digital experiences.</p>
          <p className="intro-text">From building projects to broadcasting and leading teams, I love connecting ideas and people to make something meaningful.</p>
          <div className="about-facts">
            <div><span>STUDYING AT</span><strong>BINUS University</strong></div>
            <div className="about-focus"><span>MY FOCUS</span>
              <ul className="about-focus-tags" aria-label="Areas of focus">
                <li>Intelligent Systems</li><li>Web Development</li><li>Full-Stack Development</li><li>AI Engineering</li>
              </ul>
            </div>
          </div>
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
