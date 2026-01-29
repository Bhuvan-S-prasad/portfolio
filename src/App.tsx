import Hero from "./components/Hero"
import Navbar from "./components/Navbar"

function App() {

  return (
    <>
      <div className='relative w-screen min-h-screen overflow-x-auto'>
        <Navbar />
        <Hero />  
      </div>
    </>
  )
}

export default App
