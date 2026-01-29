import { useEffect } from "react"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Summary from "./components/Summary"

function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <div className='relative w-screen min-h-screen overflow-x-auto'>
        <Navbar />
        <Hero />
        <Summary />
        <section className="min-h-screen"></section>
        <section className="min-h-screen"></section>

        <section className="min-h-screen"></section>



      </div>
    </>
  )
}

export default App
