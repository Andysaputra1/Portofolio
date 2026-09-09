import Navbar from "./components/Navbar.tsx";   
import Hero from "./components/Hero";
import About from "./components/Aboutme.tsx";
import ChatWidget from "./components/ChatWidget.tsx";
import TechStack from "./components/Skills";
import Projects from "./components/Projects.tsx";
import Contact from "./components/Contact.tsx";
import OrganizationExperience from "./components/OrganizationExperience.tsx";
import "./polish.css";
export default function App() {
  return (
    <>
    <a className="skip-link" href="#about">Skip to content</a>
    <Navbar />
    <main>
    <Hero/>
    <About/>
    <ChatWidget/>
    <TechStack/>
    <OrganizationExperience/>
    <Projects/>
    <Contact/>
    </main>
    <footer className="site-footer">
      <a href="#home" className="footer-signature">Andy Saputra.</a>
      <span>Built with curiosity. Crafted with purpose.</span>
      <a href="#home">Back to top <span aria-hidden="true">↗</span></a>
    </footer>
    </>
  )
  
}
