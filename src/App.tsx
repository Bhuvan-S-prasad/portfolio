import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Summary from "./components/Summary"
import FocusArea from "./components/FocusArea"
import ReactLenis from "lenis/react"
import Preloader from "./components/UI/Preloader"
import About from "./components/about"

function App() {
  return (
    <>
      <Preloader />
      <ReactLenis root className='relative w-screen min-h-screen overflow-x-hidden'>
        <Navbar />
        <Hero />
        <Summary />
        <FocusArea />
        <About />
      </ReactLenis>
    </>
  )
}

export default App
