// src/components/About.tsx
import meImg from "../images/Photo1.jpg";
import useScrollReveal from "../hook/useScrollReveal.ts";
import type { CSSProperties } from "react";

const si = (i: number) => ({ ["--i" as any]: i } as CSSProperties);

export default function About() {
  // refs untuk elemen yang ingin direveal
  const headRef  = useScrollReveal<HTMLDivElement>();
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const sub1Ref  = useScrollReveal<HTMLParagraphElement>();
  const sub2Ref  = useScrollReveal<HTMLParagraphElement>();
  const textRef  = useScrollReveal<HTMLParagraphElement>({  threshold: 0.15 });
  const photoRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="intro section">
      <div className="intro-grid">
        <div className="intro-copy">
          {/* head: pakai stagger */}
          <div className="intro-head reveal-stagger" ref={headRef}>
            <h1 className="intro-title reveal" ref={titleRef} style={si(0)}>
              Andy Saputra
            </h1>

            <p className="intro-sub reveal" ref={sub1Ref} style={si(1)}>
              Undergraduate Computer Science Student (System Intelligence) at Binus University | Passionate about Innovation & Leadership
            </p>

            <p className="intro-sub alt reveal" ref={sub2Ref} style={si(2)}>
              Streaming: Intelligent Systems
            </p>
          </div>

          <p className="intro-text reveal" ref={textRef} style={si(3)}>
            technology is not just about systems or code—it represents creativity, collaboration, and the drive to shape new possibilities. As a computer science student with experiences spanning technology, broadcasting, and leadership, I see innovation as a way to inspire change and create trends. I am passionate about utilizing emerging technologies, exploring fresh ideas, and fostering creativity to build meaningful solutions. Along the way, I continue to develop adaptability, communication, and leadership skills that prepare me to collaborate effectively and contribute to impactful projects with purpose-driven individuals.
          </p>
        </div>

        {/* Right: photo card */}
        <div className="intro-photo-card reveal" ref={photoRef}>
          <img className="intro-photo" src={meImg} alt="Andy Saputra" />
        </div>
      </div>
    </section>
  );
}