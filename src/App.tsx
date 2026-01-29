import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Summary from "./components/Summary"
import FocusArea from "./components/FocusArea"
import ReactLenis from "lenis/react"

function App() {
  return (
    <>
      <ReactLenis root className='relative w-screen min-h-screen overflow-x-hidden'>
        <Navbar />
        <Hero />
        <Summary />
        <FocusArea />
      </ReactLenis>
    </>
  )
}

export default App
