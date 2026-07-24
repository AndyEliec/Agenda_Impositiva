import React from 'react';
import { Search, Settings, Rocket, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    id: 1,
    title: "Análisis y Eficiencia Operacional",
    icon: <Search className="text-cyan-400" size={48} />, // Increased icon base size
    description: "Evaluación integral de procesos (contables, administrativos, RR.HH.) para identificar cuellos de botella. Se enfoca en la Eficiencia Operacional y en la Selección/Seguimiento de talento (voluntarios/practicantes), asegurando la optimización de flujos de trabajo."
  },
  {
    id: 2,
    title: "Estrategia Tecnológica y Formación",
    icon: <Settings className="text-emerald-400" size={48} />,
    description: "Diseño e implementación de soluciones a medida, incluyendo el desarrollo de macros en Excel/VBA para reportes y la automatización de conciliaciones complejas. Además, ofrece capacitación en tecnologías (Excel, Power BI, HTML), normativas contables, y redes profesionales (LinkedIn)."
  },
  {
    id: 3,
    title: "Ejecución Contable, Fiscal y Soporte",
    icon: <Rocket className="text-purple-400" size={48} />,
    description: "Realización de registraciones contables diarias, conciliaciones bancarias, liquidación de impuestos (IVA, IIBB) y manejo de aplicativos (AFIP, ARBA, AGIP). Incluye análisis de cuentas, soporte en auditorías, y gestión de documentación legal (legalización de balances, certificación Pyme)."
  }
];

const Methodology: React.FC = () => {
  return (
    <section id="methodology" className="py-20 md:py-32 lg:py-40 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center mb-20 md:mb-24 lg:mb-32">
          <span className="text-cyan-500 font-bold tracking-widest text-sm md:text-base lg:text-lg uppercase">Cómo Trabajo</span>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mt-4 mb-8">De lo Manual a lo Automatizado</h2>
          <p className="text-slate-400 text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Mi enfoque no es reemplazar al contador, sino darle superpoderes mediante la tecnología.
          </p>
        </div>

        {/* 
          Grid Desktop Updates:
          - lg:gap-16 (More air between columns)
          - lg:items-start
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 relative items-start">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-20 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-cyan-900 via-emerald-900 to-purple-900 -z-10 border-t border-dashed border-slate-700"></div>

          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center group h-full p-4 lg:p-6"
            >
              {/* Icon Container: Increased to lg:w-40 lg:h-40 for massive desktop presence */}
              <div className="w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full glass-panel flex items-center justify-center mb-8 lg:mb-10 border border-slate-700 group-hover:border-cyan-500/50 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 transition-all duration-300 relative bg-slate-900 shrink-0 transform group-hover:scale-105">
                {React.cloneElement(step.icon as React.ReactElement<any>, { size: 56 })}
                <div className="absolute -top-2 -right-2 w-10 h-10 lg:w-12 lg:h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 text-slate-300 font-bold text-lg lg:text-xl shadow-lg">
                  {step.id}
                </div>
              </div>
              
              {/* Typography Scaling */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">{step.title}</h3>
              <p className="text-slate-400 text-base md:text-lg lg:text-xl leading-relaxed px-2 lg:px-0">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Methodology;