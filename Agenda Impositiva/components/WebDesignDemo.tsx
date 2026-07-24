import React, { useState } from 'react';
import { Menu, X, Smartphone, Monitor, LayoutGrid, Zap } from 'lucide-react';

const WebDesignDemo: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200 text-slate-900">
      <div className="w-full px-6 md:px-12 lg:px-20">
        
        {/* Label for the Portfolio Context */}
        <div className="mb-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            Demo Técnica
          </span>
          <h2 className="text-3xl font-bold text-slate-900">Implementación Responsive & Grid</h2>
          <p className="text-slate-500 mt-2">
            Ejemplo en vivo de una Landing Page "Mobile First" con HTML5, TSX y Tailwind.
          </p>
        </div>

        {/* 
          --- DEMO CONTAINER (Simulates a browser window) --- 
          Responsive Height: Fixed height on mobile/tablet for containment, Auto height on large desktop for better viewing 
        */}
        <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xl bg-white h-[600px] md:h-[700px] lg:h-auto overflow-y-auto lg:overflow-visible relative scroll-smooth">
          
          {/* 
            1. HEADER & NAVIGATION 
            - Uses Flexbox for alignment.
            - Demonstrates Mobile (Hidden/Vertical) vs Desktop (Visible/Horizontal).
          */}
          <header className="bg-indigo-600 text-white sticky top-0 z-20 shadow-md">
            <div className="w-full px-6 md:px-10">
              <div className="flex justify-between items-center h-16">
                
                {/* Logo */}
                <div className="flex items-center gap-2 font-bold text-xl">
                  <LayoutGrid />
                  <span>GridMaster</span>
                </div>

                {/* Mobile Menu Button (Visible < md, Hidden >= md) */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 hover:bg-indigo-500 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation (Hidden < md, Visible >= md, Flex Row) */}
                <nav className="hidden md:flex space-x-8">
                  {['Producto', 'Soluciones', 'Precios', 'Soporte'].map((item) => (
                    <a key={item} href="#" className="text-indigo-100 hover:text-white transition-colors text-sm font-medium">
                      {item}
                    </a>
                  ))}
                  <button className="bg-white text-indigo-600 px-4 py-2 rounded-md font-bold text-sm hover:bg-indigo-50 transition-colors">
                    Empezar
                  </button>
                </nav>
              </div>
            </div>

            {/* Mobile Navigation Dropdown (Visible only when open & < md, Flex Column) */}
            {isMenuOpen && (
              <nav className="md:hidden bg-indigo-700 border-t border-indigo-500 absolute w-full left-0 z-30 shadow-lg">
                <div className="flex flex-col p-4 space-y-4">
                  {['Producto', 'Soluciones', 'Precios', 'Soporte'].map((item) => (
                    <a key={item} href="#" className="text-indigo-100 hover:text-white block py-2 px-3 hover:bg-indigo-600 rounded-md">
                      {item}
                    </a>
                  ))}
                  <button className="bg-white text-indigo-600 w-full py-3 rounded-md font-bold hover:bg-indigo-50">
                    Empezar Ahora
                  </button>
                </div>
              </nav>
            )}
          </header>

          {/* 
            2. MAIN LAYOUT - CSS GRID 
          */}
          <main className="w-full px-6 md:px-12 py-8 relative z-0">
            
            {/* GRID SECTION 1: HERO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
              {/* Text Content: Spans full on mobile, 7 cols on desktop */}
              <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
                <span className="text-indigo-600 font-bold tracking-wide uppercase text-sm">Mobile First Design</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Construye experiencias web <span className="text-indigo-600">adaptables.</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-lg">
                  Utilizando la potencia de CSS Grid para la estructura y Flexbox para los componentes, garantizamos una visualización perfecta en cualquier dispositivo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <Monitor size={20} /> Ver Demo Desktop
                  </button>
                  <button className="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <Smartphone size={20} /> Ver Demo Móvil
                  </button>
                </div>
              </div>

              {/* Visual/Image: Spans full on mobile, 5 cols on desktop */}
              <div className="lg:col-span-5 order-1 lg:order-2">
                <div className="bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-2xl p-8 aspect-square flex items-center justify-center shadow-inner">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transform -rotate-6 transition-transform hover:rotate-0">
                    <div className="flex gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="space-y-2 w-48">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRID SECTION 2: FEATURES */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-10 text-slate-800">Características del Sistema</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Grid Layout", icon: <LayoutGrid />, desc: "Estructura bidimensional para layouts complejos y robustos." },
                  { title: "Flexbox Components", icon: <Zap />, desc: "Alineación unidimensional perfecta para componentes internos." },
                  { title: "Responsive Media", icon: <Monitor />, desc: "Imágenes y tipografía que escalan fluidamente." },
                ].map((feature, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-indigo-300 transition-all group">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h4>
                    <p className="text-slate-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FLEX SECTION: CTA */}
            <div className="bg-slate-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">¿Listo para optimizar?</h3>
                <p className="text-slate-400">Integre diseño moderno en su próximo proyecto.</p>
              </div>
              <button className="w-full md:w-auto px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg transition-colors whitespace-nowrap">
                Contactar Desarrollo
              </button>
            </div>

          </main>
        </div>
      </div>
    </section>
  );
};

export default WebDesignDemo;