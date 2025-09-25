import Navbar from "./components/Navbar.tsx";   
import Hero from "./components/Hero";
import About from "./components/Aboutme.tsx";
import ChatWidget from "./components/ChatWidget.tsx";
export default function App() {
  return (
    <>
    <Navbar />
    <Hero/>
    <About/>
    <ChatWidget/>
    </>
  )
  
}
