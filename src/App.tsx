import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero";
import About from "./components/Aboutme.tsx";
import ChatWidget from "./components/ChatWidget.tsx";
import TechStack from "./components/Skills";
import Projects from "./components/Projects.tsx";
import Contact from "./components/Contact.tsx";
import OrganizationExperience from "./components/OrganizationExperience.tsx";
import NavRunner from "./components/NavRunner";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#about">Skip to content</a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <OrganizationExperience />
        <Projects />
        <Contact />
      </main>
      <ChatWidget />
      <footer className="site-footer">
        <div className="footer-track" aria-hidden="true"><span className="footer-runner"><NavRunner /></span></div>
        <div className="wrap footer-inner">
          <a href="#home" className="footer-mark">andy<span>.</span></a>
          <p>Designed and built by Andy Saputra, {new Date().getFullYear()}. React, TypeScript and a handful of pixel sprites.</p>
          <a href="#home" className="footer-top">Back to top</a>
        </div>
      </footer>
    </>
  );
}
