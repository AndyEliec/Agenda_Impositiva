import React from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Methodology from './components/Methodology';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-white">
      <NavBar />
      <main>
        <Hero />
        <Experience />
        <Methodology />
        <Skills />
        <Portfolio />
        <Contact />
      </main>
    </div>
  );
}

export default App;