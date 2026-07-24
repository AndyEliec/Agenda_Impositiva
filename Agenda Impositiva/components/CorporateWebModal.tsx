import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Globe, Monitor, Tablet, Smartphone, ExternalLink, 
  Search, Trash2, CheckCircle2, ShieldCheck, RefreshCw, ZoomIn, ZoomOut
} from 'lucide-react';
import { CorporatePage } from '../types';

interface CorporateWebModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_PAGES: CorporatePage[] = [
  {
    id: 'page-1',
    title: 'Estudio Contable Corimayo & Asoc.',
    client: 'Firma Contable e Impositiva',
    category: 'Finanzas y Contabilidad',
    url: 'https://estudiocorimayo-demo.web.app',
    description: 'Sitio web institucional de alta conversión con catálogo de servicios impositivos, cotizador dinámico de honorarios y canal directo de consultas.',
    status: 'Publicado',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Formspree'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-03-15'
  },
  {
    id: 'page-2',
    title: 'Portal Tech & Process Automation',
    client: 'Consultoría en Procesos',
    category: 'Tecnología & Automatización',
    url: 'https://process-tech-demo.web.app',
    description: 'Landing page para firma de consultoría tecnológica especializada en automatización con Python, KNIME y VBA para departamentos contables.',
    status: 'Demo Interactivo',
    technologies: ['React 19', 'Tailwind', 'Lucide Icons', 'Framer Motion'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-05-10'
  },
  {
    id: 'page-3',
    title: 'Portal de Clientes & Servicios Fiscales',
    client: 'Empresa de Servicios Empresariales',
    category: 'Servicios Corporativos',
    url: 'https://servicios-fiscales.com.ar',
    description: 'Plataforma corporativa web con panel de acceso a documentación fiscal, entrega de VEPs y calendario de vencimientos integrados.',
    status: 'En Desarrollo',
    technologies: ['TypeScript', 'Next.js', 'Tailwind', 'REST APIs'],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-06-01'
  }
];

const PRESET_COVER_IMAGES = [
  { label: 'Finanzas & Analítica', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
  { label: 'Tecnología & Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
  { label: 'Oficina & Negocios', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800' },
  { label: 'Diseño Moderno & Minimalista', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800' },
  { label: 'Consultoría & Estrategia', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' }
];

const CorporateWebModal: React.FC<CorporateWebModalProps> = ({ isOpen, onClose }) => {
  const [pages, setPages] = useState<CorporatePage[]>(() => {
    const saved = localStorage.getItem('corporate_pages_portfolio');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_PAGES;
  });

  const [selectedPageId, setSelectedPageId] = useState<string>(DEFAULT_PAGES[0].id);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [desktopZoom, setDesktopZoom] = useState<number>(75); // Alejado 75% por defecto en Desktop
  const [searchQuery, setSearchQuery] = useState('');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);

  // New page form state
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState('Finanzas y Contabilidad');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<'Publicado' | 'En Desarrollo' | 'Demo Interactivo'>('Publicado');
  const [newTechnologies, setNewTechnologies] = useState('React, Tailwind CSS, TypeScript');
  const [newImageUrl, setNewImageUrl] = useState(PRESET_COVER_IMAGES[0].url);
  const [customImageInput, setCustomImageInput] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  const selectedPage = pages.find(p => p.id === selectedPageId) || pages[0];
  const [addressBarUrl, setAddressBarUrl] = useState<string>(selectedPage?.url || '');

  useEffect(() => {
    if (selectedPage) {
      setAddressBarUrl(selectedPage.url);
      setIframeLoading(true);
      setIframeKey(prev => prev + 1);
    }
  }, [selectedPageId]);

  useEffect(() => {
    localStorage.setItem('corporate_pages_portfolio', JSON.stringify(pages));
  }, [pages]);

  if (!isOpen) return null;

  const handleAddressBarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = addressBarUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    // Update current selected page URL
    const updatedPages = pages.map(p => {
      if (p.id === selectedPageId) {
        return { ...p, url: formattedUrl };
      }
      return p;
    });
    setPages(updatedPages);
    setAddressBarUrl(formattedUrl);
    setIframeLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleRefreshIframe = () => {
    setIframeLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const finalImage = customImageInput.trim() || newImageUrl;
    const finalUrl = newUrl.trim() || `https://${newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.web.app`;

    const newPage: CorporatePage = {
      id: `page-${Date.now()}`,
      title: newTitle.trim(),
      client: newClient.trim() || 'Proyecto Cliente',
      category: newCategory,
      url: finalUrl,
      description: newDescription.trim(),
      status: newStatus,
      technologies: newTechnologies.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl: finalImage,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedPages = [newPage, ...pages];
    setPages(updatedPages);
    setSelectedPageId(newPage.id);

    // Reset form
    setNewTitle('');
    setNewClient('');
    setNewUrl('');
    setNewDescription('');
    setNewTechnologies('React, Tailwind CSS, TypeScript');
    setCustomImageInput('');
    setShowAddForm(false);
    setFormSuccessMessage('¡Página web registrada correctamente!');
    setTimeout(() => setFormSuccessMessage(''), 4000);
  };

  const handleDeletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pages.length <= 1) {
      alert('Debe mantener al menos una página registrada.');
      return;
    }
    const updated = pages.filter(p => p.id !== id);
    setPages(updated);
    if (selectedPageId === id) {
      setSelectedPageId(updated[0].id);
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Globe size={22} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                Páginas Web Corporativas
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                  {pages.length} Creadas
                </span>
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Explora y previsualiza desarrollos web corporativos adaptables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {formSuccessMessage && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 text-emerald-400 text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              {formSuccessMessage}
            </span>
            <button onClick={() => setFormSuccessMessage('')} className="text-emerald-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto flex flex-col lg:flex-row">
          
          {/* LEFT SIDEBAR: Page List */}
          <div className="w-full lg:w-80 xl:w-96 border-r border-slate-800 bg-slate-900/60 flex flex-col flex-shrink-0">
            
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar página por nombre o rubro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Pages Navigation List */}
            <div className="flex-grow overflow-y-auto p-3 space-y-2">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Páginas Disponibles</span>
                <span>{filteredPages.length}</span>
              </div>

              {filteredPages.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No se encontraron páginas desarrolladas.
                </div>
              ) : (
                filteredPages.map((page) => {
                  const isSelected = page.id === selectedPageId;
                  return (
                    <div
                      key={page.id}
                      onClick={() => setSelectedPageId(page.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between gap-2 ${
                        isSelected 
                          ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/5' 
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                            {page.category}
                          </span>
                          <h4 className={`text-xs md:text-sm font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {page.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {page.client}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            page.status === 'Publicado' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : page.status === 'En Desarrollo'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}>
                            {page.status}
                          </span>

                          <button
                            onClick={(e) => handleDeletePage(page.id, e)}
                            className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Eliminar registro"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                        <span className="truncate max-w-[180px] font-mono">{page.url.replace('https://', '')}</span>
                        <span>{page.createdAt}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT VIEWPORT / PREVIEW CANVAS */}
          <div className="flex-grow bg-slate-950 p-4 md:p-6 flex flex-col">
            
            {/* Viewport Control Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-3 flex flex-wrap items-center justify-between gap-3">
              
              {/* Editable URL Address Bar */}
              <form 
                onSubmit={handleAddressBarSubmit}
                className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-cyan-500 rounded-lg px-3 py-1.5 flex-grow max-w-xl text-xs font-mono text-slate-300 transition-colors"
              >
                <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
                <input
                  type="text"
                  value={addressBarUrl}
                  onChange={(e) => setAddressBarUrl(e.target.value)}
                  placeholder="https://ejemplo-pagina-corporativa.com"
                  className="w-full bg-transparent border-0 text-cyan-300 focus:outline-none text-xs font-mono"
                  title="Presiona Enter para navegar a una URL personalizada"
                />
                <button 
                  type="button" 
                  onClick={handleRefreshIframe}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                  title="Recargar página web"
                >
                  <RefreshCw size={13} className={iframeLoading ? "animate-spin text-cyan-400" : ""} />
                </button>
              </form>

              {/* View Mode Toggle: Desktop / Tablet / Mobile */}
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    deviceView === 'desktop' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Vista Escritorio (Alejamiento inteligente)"
                >
                  <Monitor size={14} />
                  <span className="hidden sm:inline">Desktop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeviceView('tablet')}
                  className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    deviceView === 'tablet' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Vista Tablet (768px)"
                >
                  <Tablet size={14} />
                  <span className="hidden sm:inline">Tablet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    deviceView === 'mobile' ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Vista Móvil (375px)"
                >
                  <Smartphone size={14} />
                  <span className="hidden sm:inline">Móvil</span>
                </button>
              </div>

              {/* Desktop Zoom Selector */}
              {deviceView === 'desktop' && (
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold px-1 flex items-center gap-1 hidden sm:flex">
                    <ZoomOut size={12} className="text-cyan-400" /> Zoom:
                  </span>
                  {[50, 67, 75, 85, 100].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setDesktopZoom(z)}
                      className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                        desktopZoom === z
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title={`Alejar vista escritorio a ${z}%`}
                    >
                      {z}%
                    </button>
                  ))}
                </div>
              )}

              {/* Open Link in New Tab */}
              <a
                href={selectedPage?.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-1 text-xs font-bold ml-auto sm:ml-0"
              >
                <ExternalLink size={14} />
                <span className="hidden md:inline">Abrir en Pestaña</span>
              </a>
            </div>

            {/* Informative Notice for External Security Restrictions */}
            <div className="mb-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-[11px] text-slate-400 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate">
                <Globe size={13} className="text-cyan-400 flex-shrink-0" />
                Visualizando sitio real: <strong className="text-slate-200">{selectedPage?.url}</strong>
                {deviceView === 'desktop' && (
                  <span className="ml-2 text-cyan-400 font-mono text-[10px]">
                    (Zoom alejado al {desktopZoom}%)
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-500 flex-shrink-0 hidden md:inline">
                Si el sitio bloquea embebidos (X-Frame-Options), usa "Abrir en Pestaña"
              </span>
            </div>

            {/* PREVIEW CANVAS CONTAINER */}
            <div className="flex-grow flex justify-center items-start overflow-y-auto min-h-[500px]">
              {selectedPage && (
                <div 
                  className={`w-full transition-all duration-300 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col ${
                    deviceView === 'mobile' 
                      ? 'max-w-[380px] my-2 border-slate-700 ring-8 ring-slate-900 rounded-[32px] p-2 h-[640px]' 
                      : deviceView === 'tablet' 
                      ? 'max-w-[720px] my-2 h-[600px]' 
                      : 'max-w-full h-[620px]'
                  }`}
                >
                  {/* REAL LIVE IFRAME PREVIEW WITH DESKTOP ZOOM */}
                  <div className="relative w-full h-full bg-slate-950 flex flex-col rounded-lg overflow-hidden">
                    {iframeLoading && (
                      <div className="absolute inset-0 z-10 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-cyan-400 p-4 text-center">
                        <RefreshCw size={28} className="animate-spin text-cyan-400" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white">Cargando sitio web en vivo...</p>
                          <p className="text-[11px] text-slate-400 font-mono truncate max-w-sm">{selectedPage.url}</p>
                        </div>
                      </div>
                    )}
                    
                    <div 
                      className="w-full h-full relative overflow-hidden"
                      style={
                        deviceView === 'desktop' && desktopZoom !== 100 ? {
                          width: `${100 / (desktopZoom / 100)}%`,
                          height: `${100 / (desktopZoom / 100)}%`,
                          transform: `scale(${desktopZoom / 100})`,
                          transformOrigin: 'top left'
                        } : {}
                      }
                    >
                      <iframe
                        key={iframeKey}
                        src={selectedPage.url}
                        title={selectedPage.title}
                        onLoad={() => setIframeLoading(false)}
                        className="w-full h-full border-0 bg-white"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CorporateWebModal;
