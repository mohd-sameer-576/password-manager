import { useState } from 'react'
import Navbar from './components/Navbar'
import ImputManager from './components/ImputManager'
import Footer from './components/Footer'
import './App.css'

function App() {


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <ImputManager />
      </main>
      <Footer />
    </div>
  )
}

export default App
