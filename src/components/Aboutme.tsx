// src/components/About.tsx
import meImg from "../images/Photo1.jpg"; // ganti dengan file fotomu

export default function About() {
  return (
    <section id="about" className="intro section">
      <div className="intro-grid">
        {/* Left: copy */}

        <div className="intro-copy">
        <div className="intro-head">
            <h1 className="intro-title">Andy Saputra</h1>
            <p className="intro-sub">
            Undergraduate Computer Science Student (System Intelligence) at Binus University | Passionate about Innovation & Leadership
            </p>
            <p className="intro-sub alt">Streaming: Intelligent Systems</p>
        </div>

        <p className="intro-text">technology is not just about systems or code—it represents creativity, collaboration, and the drive to shape new possibilities. As a computer science student with experiences spanning technology, broadcasting, and leadership, I see innovation as a way to inspire change and create trends. I am passionate about utilizing emerging technologies, exploring fresh ideas, and fostering creativity to build meaningful solutions. Along the way, I continue to develop adaptability, communication, and leadership skills that prepare me to collaborate effectively and contribute to impactful projects with purpose-driven individuals.</p>
        </div>


        {/* Right: photo card */}
        <div className="intro-photo-card">
          <img src={meImg} alt="Ravellino by the river at night" />
        </div>
      </div>
    </section>
  );
}
