import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Skills from "./components/Skills"
import FocusArea from "./components/FocusArea"
import ReactLenis from "lenis/react"
import Preloader from "./components/UI/Preloader"
import About from "./components/About"
import Projects from "./components/Projects"
import Artworks from "./components/Artworks"
import ContactMe from "./components/ContactMe"
import Contact from "./components/Contact"

function App() {
  return (
    <>
      <Preloader />
      <ReactLenis root className='relative w-screen min-h-screen overflow-x-hidden'>
        <Navbar />
        <Hero />
        <FocusArea />
        <About />
        <Projects />
        <Skills />
        <Artworks />
        <ContactMe />
        <Contact />
      </ReactLenis>
    </>
  )
}

export default App
