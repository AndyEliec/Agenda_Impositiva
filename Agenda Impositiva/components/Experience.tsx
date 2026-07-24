import React from 'react';
import { ExperienceItem } from '../types';
import { motion } from 'framer-motion';

const experiences: ExperienceItem[] = [
  {
    id: '1',
    role: 'Migración y Transición de Sistemas ERP',
    company: 'Fillkolor',
    period: '2025 - Presente',
    description: 'Liderando el cambio de un sistema antiguo a uno nuevo.',
    achievements: [
      'Eficiencia Operacional y de Procesos',
      'Brindar soporte en nuevas tecnologías',
      'Diseño de macros en Excel/VBA para reportes de impuestos.',
      'Automatización de conciliaciones bancarias complejas.'
    ]
  },
  {
    id: '2',
    role: 'Contadora Senior',
    company: 'Fillkolor',
    period: '2025 - Presente',
    description: 'Contabilidad integral',
    achievements: [
      'Conciliaciones Bancarias',
      'Control de cuentas corrientes, cobranzas y pagos',
      'Análisis de cuentas y ayudara general para el armado de balances',
      'Líder de grupos de trabajo por sistema de Practicantes',
      'Brindar soporte para auditorias',
      'Reducción del tiempo de cierre mensual mediante VBA',
      'Capacitación de personal junior en normativas contables.'
    ]
  },
  {
    id: '3',
    role: 'Administrativa Contable',
    company: 'Red GCP',
    period: '2023 - 2024',
    description: 'Contabilidad integral',
    achievements: [
      'Registraciones contables diarias de facturas compras ventas, pagos y cobranzas',
      'Conciliaciones bancarias',
      'Análisis de cuentas y ayudara general para el armado de balances',
      'Manejo del sistema ONVIO',
      'Legalización de balances y certificación Pyme',
      'Manejo de las páginas de consejos de CABA',
      'Manejo de aplicativos de AFIP, ARBA y AGIP',
      'Liquidación de IIBB e IVA',
      'Líder de grupos de trabajo por sistema de Practicante'
    ]
  },
  {
    id: '4',
    role: 'Administrativa Contable',
    company: 'JCF Consultores',
    period: '2020 - 2023',
    description: 'Apoyo admnistrativo contable',
    achievements: [
      'Registraciones contables diarias de facturas compras ventas, pagos y cobranzas',
      'Conciliaciones bancarias',
      'Análisis de cuentas y ayudara general para el armado de balances',
      'Manejo del sistema ONVIO',
      'Legalización de balances y certificación Pyme',
      'Manejo de las páginas de consejos de CABA',
      'Manejo de aplicativos de AFIP, ARBA y AGIP',
      'Liquidación de IIBB e IVA',
      'Manejo de grupos de trabajo'
    ]
  },
  {
    id: '5',
    role: 'Promotor del Conocimiento',
    company: 'BA Multiplica',
    period: '2023',
    description: 'Soporte en facturación y control de inventarios.',
    achievements: [
      'Impartición de cursos sobre herramientas tecnológicas: Microsoft Excel HTML, CSS, JavaScript, Power BI y PowerPoint',
      'Capacitación en Redes Profesionales: Instrucción en el uso efectivo de LinkedIn, orientando a los alumnos sobre cómo crear y optimizar perfiles, establecer redes de contactos profesionales y aprovechar las oportunidades laborales en línea',
      'Sensibilización en Temáticas Sociales y Ambientales: Educación sobre igualdad de género, consumo responsable y sustentabilidad',
      'Diseño de Material Didáctico: Elaboración de recursos educativos y ejercicios prácticos, para facilitar el aprendizaje y asegurar la adquisición de habilidades clave'
    ]
  },
  {
    id: '6',
    role: 'Reclutamiento de Talento Humano',
    company: 'AIESEC',
    period: '2019 - 2020',
    description: 'Soporte en facturación y control de inventarios.',
    achievements: [
      'Contactar y entrevistar a potenciales voluntarios',
      'Seleccionar perfiles adecuados a proyectos, en base a estudios experiencia y capacidades de cada persona',
      'Realizar seguimiento de su proceso de selección',
      'Recibimiento y seguimiento de voluntarios durante la realización de sus proyectos'
    ]
  }
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 md:py-32 bg-slate-900/50">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Trayectoria Profesional</h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-4xl mx-auto">
            Una evolución constante desde los fundamentos contables hacia la innovación tecnológica.
          </p>
        </div>

        {/* 
           - Removed 'max-w-5xl' to allow full width 
           - Adjusted margin-left (ml) logic to maintain layout integrity without centering (mx-auto removed)
        */}
        <div className="relative border-l-2 border-slate-700 ml-4 md:ml-8 lg:ml-20 space-y-16">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id} 
              className="relative pl-8 md:pl-16 pr-4 md:pr-10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Dot */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-4">
                <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                <span className="text-cyan-400 font-mono text-lg font-medium">{exp.company}</span>
                <span className="text-slate-500 text-base md:ml-auto font-medium">{exp.period}</span>
              </div>
              
              <p className="text-slate-300 mb-6 text-lg max-w-7xl">{exp.description}</p>
              
              <ul className="space-y-3 max-w-7xl">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start text-slate-400 text-base md:text-lg">
                    <span className="mr-3 text-cyan-500 mt-1.5 text-sm">▹</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;