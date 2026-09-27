import { useState } from "react"
import Navbar from "./components/Navbar"
import Skills from "./components/Skills"
import FocusArea from "./components/FocusArea"
import Preloader from "./components/UI/Preloader"
import SmoothScroll from "./components/UI/SmoothScroll"
import About from "./components/About"
import Projects from "./components/Projects"
import Artworks from "./components/Artworks"
import ContactMe from "./components/ContactMe"
import Contact from "./components/Contact"
import Hero from "./components/Hero"

function App() {
  const [ready, setReady] = useState(false)

  return (
    <SmoothScroll>
      <Preloader onComplete={() => setReady(true)} />
      <Navbar />
      <main className="relative w-full min-h-screen overflow-x-clip">
        <Hero ready={ready} />
        <About />
        <FocusArea />
        <Projects />
        <Skills />
        <Artworks />
        <ContactMe />
        <Contact />
      </main>
    </SmoothScroll>
  )
}

export default App
