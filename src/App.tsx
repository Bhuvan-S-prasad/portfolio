import { useState } from "react"
import Navbar from "./components/Navbar"
import Skills from "./components/Skills"
import FocusArea from "./components/FocusArea"
import Preloader from "./components/UI/Preloader"
import SmoothScroll from "./components/UI/SmoothScroll"
import Chapter from "./components/UI/Chapter"
import Cursor from "./components/UI/Cursor"
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
      <Cursor />
      <Navbar />
      <main className="relative w-full min-h-screen overflow-x-clip">
        <Hero ready={ready} />

        {/* About + Expertise share one dark surface, so they transition as one chapter. */}
        <Chapter enter exit className="bg-black">
          <About />
          <FocusArea />
        </Chapter>

        <Projects />

        <Chapter enter>
          <Skills />
        </Chapter>

        <Artworks />
        <ContactMe />

        <Chapter enter className="bg-black">
          <Contact />
        </Chapter>
      </main>
    </SmoothScroll>
  )
}

export default App
