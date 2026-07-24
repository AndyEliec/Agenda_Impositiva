import React, { useState } from 'react';
import { Project } from '../types';
import { ExternalLink, Globe, Calendar, Layers, Sparkles } from 'lucide-react';
import CorporateWebModal from './CorporateWebModal';
import TaxCalendarModal from './TaxCalendarModal';

const projects: Project[] = [
  {
    id: '1',
    title: 'Consultor de Padrones (ARBA & AGIP)',
    category: 'Automatización',
    description: 'Herramienta integral desarrollada en Excel para automatizar la búsqueda y cruce de alícuotas de Retenciones y Percepciones. Utiliza Power Query para modelar y conectar padrones mensuales de alto volumen (CABA y Bs. As.) y VBA para permitir consultas dinámicas por CUIT, reduciendo drásticamente el tiempo de validación fiscal.',
    technologies: ['Excel', 'VBA', 'PowerQuery', 'GitHub'],
    imageUrl: 'https://raw.githubusercontent.com/AndyEliec/PADRON-PERCEPCIONES-Y-RETENCIONES-IIBB/refs/heads/main/imagenes/Portada%20padrones.PNG', 
    link: 'https://github.com/AndyEliec/PADRON-PERCEPCIONES-Y-RETENCIONES-IIBB.git',
    actionType: 'external'
  },
  {
    id: '2',
    title: 'Pagina Web Corporativa',
    category: 'Desarrollo',
    description: 'Gestor e integrador de páginas web corporativas desarrolladas. Permite previsualizar sitios institucionales adaptables en vista multidispositivo (Desktop, Tablet, Móvil) e integrar/cargar nuevos proyectos web personalizados.',
    technologies: ['React', 'TypeScript', 'HTML5', 'JSON'],
    imageUrl: 'https://raw.githubusercontent.com/AndyEliec/hello-world/refs/heads/main/imagen/CapatulaPaginaWeb.JPG', 
    link: 'https://ai.studio/apps/drive/1ThVCP4tg70aVW9SF5yZODPtmudY25Q9U',
    actionType: 'corporate_web'
  },
  {
    id: '5',
    title: 'Agenda Impositiva & Alertas Telegram',
    category: 'Automatización',
    description: 'Sistema automatizado de agenda de vencimientos impositivos (AFIP, ARBA, AGIP, Convenio Multilateral). Incluye calendario inteligente por terminación de CUIT y Bot de Telegram integrado para notificaciones automáticas previas.',
    technologies: ['GoogleSheet', 'TypeScript','Telegram API', 'Automation'],
    imageUrl: 'https://raw.githubusercontent.com/AndyEliec/Agenda_Impositiva/refs/heads/main/Agenda%20Impositiva/Image/Captura%20de%20pantalla%202026-07-24%20141729.png',
    link: 'https://script.google.com/macros/s/AKfycbzHZKVFwnq1ofwe_p1id9lHQAxZu3Bs11PvjmVYYT4gAaOpeBGBIFiVlto3F4qQh6E/exec',
    actionType: 'external'
  },
  {
    id: '3',
    title: 'Extracto Bancario de PDF a EXCEL',
    category: 'Automatización',
    description: 'Workflow automatizado en KNIME diseñado para extraer, limpiar y estructurar datos financieros desde archivos PDF no nativos. El proceso transforma datos desordenados en tablas de Excel listas para el análisis y la conciliación bancaria, eliminando la carga manual de datos.',
    technologies: ['KNIME', 'Excel'],
    imageUrl: 'https://raw.githubusercontent.com/AndyEliec/Conciliacion_Bancaria/refs/heads/main/imagen/PDFaExcel.jpg', 
    link: 'https://sites.google.com/view/extractobancariodepdfaexcel',
    actionType: 'external'
  },
  {
    id: '4',
    title: 'Conciliación Bancaria Automatizada',
    category: 'Contabilidad',
    description: 'Sistema desarrollado en Excel con VBA para optimizar el proceso de conciliacion bancaria, reduciendo el trabajo manual operativo.',
    technologies: ['VBA', 'Excel'],
    imageUrl: 'https://raw.githubusercontent.com/AndyEliec/Conciliacion_Bancaria/refs/heads/main/imagen/CapatulaConciliacion.JPG', 
    link: 'https://github.com/AndyEliec/Conciliacion_Bancaria.git',
    actionType: 'external'
  }
];

const Portfolio: React.FC = () => {
  const [isCorporateWebModalOpen, setIsCorporateWebModalOpen] = useState(false);
  const [isTaxCalendarModalOpen, setIsTaxCalendarModalOpen] = useState(false);

  const handleProjectClick = (project: Project, e: React.MouseEvent) => {
    if (project.actionType === 'corporate_web') {
      e.preventDefault();
      setIsCorporateWebModalOpen(true);
    } else if (project.link && project.link !== '#') {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="portfolio" className="py-16 md:py-20 bg-slate-900/50">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-3">
            Portfolio de Soluciones
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Proyectos Destacados</h2>
          <p className="text-slate-400 text-lg md:text-xl font-light">Soluciones reales para problemas complejos de contabilidad, tecnología y automatización.</p>
        </div>

        {/* Responsive Grid Layout for 5 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group relative overflow-hidden rounded-xl glass-panel border border-slate-700 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 flex flex-col h-full cursor-pointer"
              onClick={(e) => handleProjectClick(project, e)}
            >
              {/* Image Aspect Ratio */}
              <div className="aspect-video w-full overflow-hidden border-b border-slate-800 relative">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                {/* Badge Overlay for Interactive Modals */}
                {project.actionType === 'corporate_web' && (
                  <div className="absolute top-3 right-3 bg-cyan-500/90 text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <Globe size={13} /> Gestor Interactivo
                  </div>
                )}

                {project.actionType === 'tax_calendar' && (
                  <div className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <Calendar size={13} /> Bot Telegram
                  </div>
                )}
              </div>
              
              {/* Card Body */}
              <div className="p-5 md:p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{project.category}</span>
                    <h3 className="text-lg md:text-xl font-bold text-white mt-1.5 leading-tight group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {project.actionType === 'external' ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors"
                      title="Ver proyecto externo"
                    >
                      <ExternalLink size={20} />
                    </a>
                  ) : (
                    <div className="text-slate-400 group-hover:text-cyan-400 p-2 group-hover:bg-cyan-500/10 rounded-full transition-colors">
                      {project.actionType === 'corporate_web' ? <Globe size={20} /> : <Calendar size={20} />}
                    </div>
                  )}
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-5 flex-grow line-clamp-4 font-light">
                  {project.description}
                </p>

                {/* Interactive Action Button for Specialized Modals */}
                {project.actionType === 'corporate_web' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsCorporateWebModalOpen(true); }}
                    className="w-full mb-4 py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Globe size={14} /> Explorar & Cargar Páginas Web
                  </button>
                )}

                {project.actionType === 'tax_calendar' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsTaxCalendarModalOpen(true); }}
                    className="w-full mb-4 py-2 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Calendar size={14} /> Ver Agenda & Bot Telegram
                  </button>
                )}
                
                <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-slate-800">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800/80 text-slate-300 border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modals */}
      <CorporateWebModal 
        isOpen={isCorporateWebModalOpen} 
        onClose={() => setIsCorporateWebModalOpen(false)} 
      />

      <TaxCalendarModal 
        isOpen={isTaxCalendarModalOpen} 
        onClose={() => setIsTaxCalendarModalOpen(false)} 
      />
    </section>
  );
};

export default Portfolio;
