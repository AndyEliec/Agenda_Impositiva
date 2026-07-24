import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Database, FileSpreadsheet, Cpu, Brain, Calculator, CheckCircle2, BarChart3, Layers, Terminal } from 'lucide-react';

type Category = 'finance' | 'tech' | 'soft';

const skillCategories = {
  finance: {
    label: "Contabilidad",
    icon: <Calculator />,
    color: "emerald",
    items: [
      { name: "Contabilidad e Impuestos", level: 95, desc: "Manejo integral de aplicativos AFIP, ARBA y AGIP, liquidación de IVA e IIBB. y soporte en auditorías." },
      { name: "Análisis y Control de Gestión", level: 90, desc: "Análisis de cuentas, Control de Cobranzas/Pagos y se mencionó el manejo del sistema ONVIO, TANGO y FLEXXUS" },
      { name: "Excel Avanzado (VBA)", level: 98, desc: "Experto en diseño de macros en Excel/VBA para reportes complejos e impuestos. Automatización de conciliaciones bancarias y reducción del tiempo de cierre mensual. Brinda soporte en nuevas tecnologías y BI." }
    ]
  },
  tech: {
    label: "Arsenal Tecnológico",
    icon: <Terminal />,
    color: "cyan",
    items: [
      { name: "Python Analytics", level: 85, desc: "Pandas, NumPy" },
      { name: "SQL & Bases de Datos", level: 75, desc: "Consultas complejas, Modelado ER" },
      { name: "Business Intelligence", level: 92, desc: "Power BI, DAX, Tableau, Looker" }
    ]
  },
  soft: {
    label: "Soft Skills & Estrategia",
    icon: <Brain />,
    color: "purple",
    items: [
      { name: "Pensamiento Analítico", level: 95, desc: "Resolución lógica de problemas" },
      { name: "Gestión de la Eficiencia Operacional", level: 90, desc: "Liderazgo en la reestructuración y optimización de flujos contables/administrativos." },
      { name: "Comunicación Efectiva", level: 85, desc: "Traducción técnico-financiera" }
    ]
  }
};

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('tech');

  return (
    <section id="skills" className="py-24 relative bg-slate-900 overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.5)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none"></div>

      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
              <Layers className="text-cyan-400" /> 
              Capacidades Integradas
            </h2>
            <p className="text-slate-400 max-w-xl text-lg">
              Un stack de competencias diseñado para cerrar la brecha entre la contabilidad tradicional y la tecnología moderna.
            </p>
          </div>
          
          {/* Category Selector - Dashboard Style */}
          <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 backdrop-blur-sm flex gap-2 overflow-x-auto max-w-full">
            {(Object.keys(skillCategories) as Category[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === key 
                    ? `bg-${skillCategories[key].color}-600/20 text-${skillCategories[key].color}-400 border border-${skillCategories[key].color}-500/50 shadow-[0_0_15px_rgba(0,0,0,0.3)]` 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-transparent'
                }`}
              >
                {React.cloneElement(skillCategories[key].icon as React.ReactElement<any>, { size: 16 })}
                {skillCategories[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Visual/Context */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`h-full p-8 rounded-3xl bg-gradient-to-br border relative overflow-hidden flex flex-col justify-center ${
                  activeCategory === 'finance' ? 'from-emerald-900/40 to-slate-900 border-emerald-500/30' :
                  activeCategory === 'tech' ? 'from-cyan-900/40 to-slate-900 border-cyan-500/30' :
                  'from-purple-900/40 to-slate-900 border-purple-500/30'
                }`}
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 ${
                  activeCategory === 'finance' ? 'bg-emerald-500/20 text-emerald-400' :
                  activeCategory === 'tech' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {React.cloneElement(skillCategories[activeCategory].icon as React.ReactElement<any>, { size: 40 })}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {skillCategories[activeCategory].label}
                </h3>
                
                <p className="text-slate-300 leading-relaxed">
                  {activeCategory === 'finance' && "La base fundamental. Comprender el 'qué' y el 'por qué' de los datos financieros es crucial antes de intentar optimizarlos."}
                  {activeCategory === 'tech' && "Las herramientas de transformación. El conjunto de utilidades que me permiten automatizar tareas, analizar grandes volúmenes de datos y visualizar resultados."}
                  {activeCategory === 'soft' && "El puente humano. La capacidad de traducir hallazgos técnicos en estrategias de negocio comprensibles para la dirección."}
                </p>

                {/* Decorative circle */}
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                   activeCategory === 'finance' ? 'bg-emerald-500' :
                   activeCategory === 'tech' ? 'bg-cyan-500' : 'bg-purple-500'
                }`}></div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Interactive Skill Bars */}
          <div className="lg:col-span-2 grid gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, staggerChildren: 0.1 }}
                className="space-y-4"
              >
                {skillCategories[activeCategory].items.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{item.name}</h4>
                      <span className={`text-xs font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700 ${
                        activeCategory === 'finance' ? 'text-emerald-400' :
                        activeCategory === 'tech' ? 'text-cyan-400' :
                        'text-purple-400'
                      }`}>
                        Nivel: {item.level}%
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                    
                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                        className={`absolute top-0 left-0 h-full rounded-full ${
                          activeCategory === 'finance' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                          activeCategory === 'tech' ? 'bg-gradient-to-r from-cyan-600 to-cyan-400' :
                          'bg-gradient-to-r from-purple-600 to-purple-400'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;