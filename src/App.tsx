import Navbar from "./components/Navbar.tsx";   
import Hero from "./components/Hero";
import About from "./components/Aboutme.tsx";
import ChatWidget from "./components/ChatWidget.tsx";
import TechStack from "./components/Skills";
import Projects from "./components/Projects.tsx";
import Contact from "./components/Contact.tsx";
export default function App() {
  return (
    <>
    <Navbar />
    <Hero/>
    <About/>
    <ChatWidget/>
    <TechStack/>
    <Projects/>
    <Contact/>
    </>
  )
  
}
