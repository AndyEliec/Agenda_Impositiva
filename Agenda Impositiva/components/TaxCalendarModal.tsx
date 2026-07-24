import React, { useState } from 'react';
import { 
  X, Calendar, Bell, Send, CheckCircle, AlertTriangle, 
  Clock, Search, Filter, MessageSquare, Bot, Shield, CheckCheck, 
  ExternalLink, Sparkles, RefreshCw
} from 'lucide-react';
import { TaxDeadline } from '../types';

interface TaxCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_DEADLINES: TaxDeadline[] = [
  {
    id: 'tax-1',
    organism: 'AFIP',
    taxName: 'IVA - Declaración Jurada Mensual',
    cuitEnding: '0 - 1',
    dueDate: '18 de Agosto',
    status: 'Urgente',
    description: 'Presentación y pago de la Declaración Jurada mensual del Impuesto al Valor Agregado.'
  },
  {
    id: 'tax-2',
    organism: 'AGIP',
    taxName: 'Ingresos Brutos CABA (Contribuyentes Locales)',
    cuitEnding: '0 - 1 - 2 - 3',
    dueDate: '19 de Agosto',
    status: 'Próximo',
    description: 'Anticipo mensual de Ingresos Brutos CABA para contribuyentes locales.'
  },
  {
    id: 'tax-3',
    organism: 'ARBA',
    taxName: 'Ingresos Brutos PBA - Agentes de Retención',
    cuitEnding: 'Todos los CUITs',
    dueDate: '21 de Agosto',
    status: 'Próximo',
    description: 'Presentación de quincena y depósito de retenciones / percepciones de Ingresos Brutos PBA.'
  },
  {
    id: 'tax-4',
    organism: 'Convenio Multilateral',
    taxName: 'SIFERE - Declaración Jurada Form. 2000',
    cuitEnding: '0 - 1 - 2',
    dueDate: '22 de Agosto',
    status: 'Próximo',
    description: 'Anticipo mensual de Ingresos Brutos régimen Convenio Multilateral.'
  },
  {
    id: 'tax-5',
    organism: 'AFIP',
    taxName: 'Autónomos y Monotributo',
    cuitEnding: 'Todos los CUITs',
    dueDate: '20 de Agosto',
    status: 'Próximo',
    description: 'Cuota mensual obligatoria Régimen Simplificado (Monotributo) y Régimen Nacional Autónomos.'
  },
  {
    id: 'tax-6',
    organism: 'AFIP',
    taxName: 'Cargas Sociales - Formulario 931',
    cuitEnding: '0 - 1 - 2 - 3',
    dueDate: '11 de Agosto',
    status: 'Presentado',
    description: 'Declaración jurada nominativa de aportes y contribuciones patronales de la seguridad social.'
  }
];

interface TelegramMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  buttons?: string[];
}

const TaxCalendarModal: React.FC<TaxCalendarModalProps> = ({ isOpen, onClose }) => {
  const [deadlines, setDeadlines] = useState<TaxDeadline[]>(INITIAL_DEADLINES);
  const [organismFilter, setOrganismFilter] = useState<string>('TODOS');
  const [selectedCuitEnding, setSelectedCuitEnding] = useState<string>('TODOS');
  const [selectedDeadline, setSelectedDeadline] = useState<TaxDeadline | null>(INITIAL_DEADLINES[0]);

  // Simulated Telegram Chat Messages
  const [chatMessages, setChatMessages] = useState<TelegramMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: '🤖 *Agenda Impositiva Bot*\n\n¡Hola! Soy tu asistente de alertas fiscales. Estoy configurado para notificar los próximos vencimientos de AFIP, AGIP, ARBA y Convenio Multilateral.',
      time: '09:00',
      buttons: ['📅 Ver Próximos Vencimientos', '🔔 Configurar Mis CUITs']
    },
    {
      id: 'msg-2',
      sender: 'bot',
      text: `⚠️ *RECORDATORIO DE VENCIMIENTO FISCAL*\n\n📌 *Impuesto:* IVA - Declaración Jurada Mensual (AFIP)\n📅 *Fecha Límite:* 18 de Agosto\n👤 *Terminación CUIT:* 0 - 1\n\nQuedan *48 horas* para presentar la DJ antes de generar recargos o intereses.`,
      time: '09:05',
      buttons: ['✅ Marcar Presentado', '📄 Adjuntar Comprobante VEP', '⏰ Recordar Mañana']
    }
  ]);

  const [inputCustomText, setInputCustomText] = useState('');

  if (!isOpen) return null;

  const filteredDeadlines = deadlines.filter(item => {
    const matchesOrganism = organismFilter === 'TODOS' || item.organism === organismFilter;
    const matchesCuit = selectedCuitEnding === 'TODOS' || item.cuitEnding.includes(selectedCuitEnding) || item.cuitEnding.includes('Todos');
    return matchesOrganism && matchesCuit;
  });

  const handleSendTelegramNotification = (deadline: TaxDeadline) => {
    setSelectedDeadline(deadline);
    
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: TelegramMessage = {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: `🔔 *ALERTA AUTOMÁTICA ENVIADA POR TELEGRAM*\n\n📌 *Organismo:* ${deadline.organism}\n📊 *Impuesto:* ${deadline.taxName}\n📅 *Vencimiento:* ${deadline.dueDate}\n🔢 *CUIT:* ${deadline.cuitEnding}\n\n📝 *Estado:* ${deadline.status.toUpperCase()}\nℹ️ ${deadline.description}`,
      time: timeString,
      buttons: ['✅ Confirmar Liquidación', '📄 Enviar VEP a Cliente', '🔔 Silenciar']
    };

    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleUserSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCustomText.trim()) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: TelegramMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputCustomText,
      time: timeString
    };

    const textUpper = inputCustomText.toLowerCase();
    let botReplyText = '🤖 Recibido. Notificación registrada en la agenda del cliente.';
    
    if (textUpper.includes('iva') || textUpper.includes('afip')) {
      botReplyText = '📋 *Consulta AFIP:* El vencimiento de IVA para CUITs finalizados en 0-1 opera el día 18. Estado: *Pendiente de carga de comprobantes*.';
    } else if (textUpper.includes('presentado') || textUpper.includes('listo')) {
      botReplyText = '✅ *¡Excelente!* Se ha actualizado el estado a *Presentado* en el panel general.';
    }

    const botMsg: TelegramMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botReplyText,
      time: timeString,
      buttons: ['✅ Confirmar', '📊 Ver Reporte']
    };

    setChatMessages(prev => [...prev, userMsg, botMsg]);
    setInputCustomText('');
  };

  const handleMarkAsPresented = (id: string) => {
    setDeadlines(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Presentado' };
      }
      return item;
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar size={22} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                Agenda Impositiva & Bot Telegram
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                  Notificaciones Automatizadas
                </span>
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Calendario interactivo de vencimientos fiscales y simulador de alertas mediante Bot de Telegram.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-grow overflow-y-auto flex flex-col lg:flex-row">
          
          {/* LEFT: TAX CALENDAR & DEADLINES */}
          <div className="w-full lg:w-1/2 border-r border-slate-800 p-5 flex flex-col bg-slate-900/40">
            
            {/* Filters */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter size={14} /> Filtrar Vencimientos
                </span>
                <button 
                  onClick={() => { setOrganismFilter('TODOS'); setSelectedCuitEnding('TODOS'); }}
                  className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Restablecer
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Organismo Fiscal</label>
                  <select
                    value={organismFilter}
                    onChange={(e) => setOrganismFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TODOS">Todos los organismos</option>
                    <option value="AFIP">AFIP (Nacional)</option>
                    <option value="AGIP">AGIP (CABA)</option>
                    <option value="ARBA">ARBA (Buenos Aires)</option>
                    <option value="Convenio Multilateral">Convenio Multilateral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Terminación de CUIT</label>
                  <select
                    value={selectedCuitEnding}
                    onChange={(e) => setSelectedCuitEnding(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TODOS">Cualquier terminación</option>
                    <option value="0">CUIT terminado en 0 - 1</option>
                    <option value="2">CUIT terminado en 2 - 3</option>
                    <option value="4">CUIT terminado en 4 - 5</option>
                    <option value="6">CUIT terminado en 6 - 7</option>
                    <option value="8">CUIT terminado en 8 - 9</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List of Deadlines */}
            <div className="flex-grow overflow-y-auto space-y-3 pr-1">
              {filteredDeadlines.map((item) => {
                const isSelected = selectedDeadline?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDeadline(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected 
                        ? 'bg-slate-800/90 border-amber-500/60 ring-1 ring-amber-500/30 shadow-lg' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            item.organism === 'AFIP' 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                              : item.organism === 'AGIP'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          }`}>
                            {item.organism}
                          </span>

                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.status === 'Urgente' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : item.status === 'Próximo'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white">{item.taxName}</h4>
                        <p className="text-xs text-slate-300 mt-1">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-3 text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-cyan-300">
                          <Clock size={13} /> {item.dueDate}
                        </span>
                        <span className="text-[11px]">CUIT: <strong className="text-slate-200">{item.cuitEnding}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status !== 'Presentado' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMarkAsPresented(item.id); }}
                            className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-emerald-600/30 text-[11px] font-medium border border-slate-700 transition-colors"
                          >
                            ✓ Marcar Listo
                          </button>
                        )}

                        <button
                          onClick={(e) => { e.stopPropagation(); handleSendTelegramNotification(item); }}
                          className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-slate-950 text-[11px] font-bold border border-sky-500/30 transition-all flex items-center gap-1"
                        >
                          <Send size={12} /> Simular Telegram
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT: TELEGRAM SIMULATOR VIEWPORT */}
          <div className="w-full lg:w-1/2 p-5 bg-slate-950 flex flex-col justify-between">
            
            {/* Telegram Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-t-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Bot Notificador Impositivo
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  </h3>
                  <span className="text-[11px] text-sky-400 font-mono">@AgendaImpositivaBot</span>
                </div>
              </div>

              <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                Telegram API
              </span>
            </div>

            {/* Telegram Messages Canvas */}
            <div className="flex-grow bg-[#0f172a] border-x border-slate-800 p-4 space-y-3 overflow-y-auto max-h-[420px] font-sans">
              
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[88%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-br-none'
                        : 'bg-slate-800/90 text-slate-100 border border-slate-700 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    
                    {/* Simulated Telegram Interactive Buttons */}
                    {msg.buttons && (
                      <div className="mt-3 grid grid-cols-1 gap-1.5 pt-2 border-t border-slate-700/60">
                        {msg.buttons.map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const now = new Date();
                              const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                              setChatMessages(prev => [
                                ...prev,
                                { id: `usr-${Date.now()}`, sender: 'user', text: btn, time: timeStr },
                                { id: `bot-${Date.now()}`, sender: 'bot', text: `👍 Acción ejecutada para: *${btn}*`, time: timeStr }
                              ]);
                            }}
                            className="w-full text-center py-1.5 px-3 bg-slate-900/80 hover:bg-sky-500/20 text-sky-300 font-semibold rounded-lg border border-sky-500/20 transition-all text-[11px]"
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'}`}>
                      {msg.time} {msg.sender === 'user' && '✓✓'}
                    </div>
                  </div>
                </div>
              ))}

            </div>

            {/* Telegram Message Input Form */}
            <form 
              onSubmit={handleUserSendReply}
              className="bg-slate-900 border border-slate-800 rounded-b-xl p-2.5 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Escribe un comando o consulta (ej: 'Vencimientos IVA', 'Listo')..."
                value={inputCustomText}
                onChange={(e) => setInputCustomText(e.target.value)}
                className="flex-grow px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all"
                title="Enviar mensaje de prueba"
              >
                <Send size={16} />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TaxCalendarModal;
