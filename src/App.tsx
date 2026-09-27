import { useState } from "react"
import Navbar from "./components/Navbar"
import Skills from "./components/Skills"
import FocusArea from "./components/FocusArea"
import Preloader from "./components/UI/Preloader"
import SmoothScroll from "./components/UI/SmoothScroll"
import Chapter from "./components/UI/Chapter"
import Cursor from "./components/UI/Cursor"
import About from "./components/About"
import Approach from "./components/Approach"
import Trajectory from "./components/Trajectory"
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
        <Chapter exit className="bg-black rounded-t-4xl">
          <About />
          <FocusArea />
        </Chapter>

        <Approach />

        <Chapter exit className="bg-black rounded-t-4xl">
          <Trajectory />
        </Chapter>

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
