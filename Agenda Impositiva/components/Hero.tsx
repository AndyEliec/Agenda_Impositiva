import React from 'react';
import { ArrowRight, FileSpreadsheet, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="min-h-[85vh] flex items-center justify-center relative overflow-hidden pt-28 pb-12">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        <div className="space-y-6 md:space-y-8 lg:space-y-10 text-center md:text-left order-2 md:order-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1.5 px-4 lg:py-2 lg:px-6 rounded-full bg-cyan-500/10 text-cyan-400 text-sm md:text-base lg:text-lg font-semibold border border-cyan-500/20 mb-6 lg:mb-8">
              Disponible para nuevos proyectos
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white tracking-tight">
              Más allá de los <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">Números.</span>
            </h1>
            <p className="mt-6 lg:mt-8 text-lg md:text-xl lg:text-3xl text-slate-400 max-w-lg lg:max-w-3xl mx-auto md:mx-0 leading-relaxed font-light">
              Soy Andrea Corimayo. Combino la precisión de la <span className="text-slate-200 font-semibold">Contabilidad</span> con la eficiencia de la <span className="text-slate-200 font-semibold">Programación</span> para optimizar procesos y transformar negocios.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row flex-wrap gap-5 lg:gap-8 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a 
              href="#portfolio" 
              onClick={(e) => scrollToSection(e, 'portfolio')}
              className="px-8 py-4 lg:px-10 lg:py-5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-lg lg:text-xl font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              Ver Proyectos <ArrowRight size={24} />
            </a>
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, 'contact')}
              className="px-8 py-4 lg:px-10 lg:py-5 rounded-lg glass-panel text-slate-300 text-lg lg:text-xl font-medium hover:bg-slate-800 transition-all border border-slate-700 cursor-pointer text-center"
            >
              Contactar
            </a>
          </motion.div>
        </div>

        <motion.div 
          className="relative order-1 md:order-2 flex justify-center md:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Main Card */}
          <div className="relative z-10 glass-panel p-6 md:p-10 lg:p-12 rounded-2xl border border-slate-600/50 shadow-2xl transform rotate-3 md:hover:rotate-0 transition-transform duration-500 max-w-sm md:max-w-xl lg:max-w-2xl w-full">
            <div className="flex justify-between items-center mb-8 lg:mb-10">
              <div className="flex gap-2 lg:gap-3">
                <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-red-500"></div>
                <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-yellow-500"></div>
                <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-green-500"></div>
              </div>
              <div className="text-sm lg:text-base text-slate-500 font-mono">analysis_tool.py</div>
            </div>
            <div className="space-y-4 lg:space-y-6 font-mono text-base md:text-lg lg:text-xl">
              <div className="text-pink-400">import <span className="text-white">pandas</span> as <span className="text-white">pd</span></div>
              <div className="text-pink-400">import <span className="text-white">finance_tools</span></div>
              <br />
              <div className="text-slate-400"># Optimizando flujo de caja</div>
              <div>
                <span className="text-purple-400">def</span> <span className="text-blue-400">optimize_process</span>(data):
              </div>
              <div className="pl-6 lg:pl-10">
                <span className="text-slate-300">analysis</span> = data.<span className="text-yellow-400">analyze_trends</span>()
              </div>
              <div className="pl-6 lg:pl-10">
                <span className="text-purple-400">return</span> analysis.<span className="text-yellow-400">maximize_efficiency</span>()
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-8 -left-8 lg:-bottom-12 lg:-left-12 glass-panel p-6 md:p-8 lg:p-10 rounded-2xl border border-slate-600/50 shadow-xl transform -rotate-6 z-0 w-64 md:w-80 lg:w-96 hidden sm:block">
            <div className="flex items-center gap-4 lg:gap-6 mb-4 lg:mb-6">
              <div className="p-3 lg:p-4 bg-green-500/20 rounded-lg text-green-400">
                <FileSpreadsheet size={28} className="lg:w-10 lg:h-10" />
              </div>
              <span className="font-bold text-slate-200 text-lg lg:text-2xl">Reporte Q3</span>
            </div>
            <div className="h-3 lg:h-4 w-full bg-slate-700 rounded-full mb-3 lg:mb-4">
              <div className="h-3 lg:h-4 bg-green-500 rounded-full w-3/4"></div>
            </div>
            <div className="text-sm lg:text-lg text-right text-green-400 font-bold">100% Automatizado</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;