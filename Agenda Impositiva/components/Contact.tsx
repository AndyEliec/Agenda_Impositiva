import React from 'react';
import { Mail, Linkedin, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  const whatsappNumber = "5491162609570"; 
  const whatsappMessage = "Hola, vi tu portafolio y me interesa conocer más sobre tu perfil.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="contact" className="py-24 lg:py-40 relative overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="glass-panel rounded-3xl p-8 md:p-16 lg:p-20 border border-slate-700/50 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <div className="space-y-8 lg:space-y-10">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6">Hablemos</h2>
                <p className="text-slate-400 mb-8 lg:mb-12 text-lg lg:text-2xl leading-relaxed">
                  ¿Buscas optimizar tus procesos contables o necesitas una visión analítica con habilidades técnicas? Estoy lista para el próximo desafío.
                </p>
              </div>
              
              <div className="space-y-8 lg:space-y-10">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-slate-800 flex items-center justify-center text-green-400 border border-slate-700 group-hover:bg-green-500/20 group-hover:border-green-500/50 transition-all">
                    <MessageCircle size={24} className="lg:w-8 lg:h-8" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base text-slate-500 font-medium uppercase tracking-wide">WhatsApp</p>
                    <span className="text-white text-lg lg:text-2xl group-hover:text-green-400 transition-colors">+54 9 11 6260 9570</span>
                  </div>
                </a>

                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all">
                    <Mail size={24} className="lg:w-8 lg:h-8" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base text-slate-500 font-medium uppercase tracking-wide">Email</p>
                    <a href="mail:andreamcorimayo@gmail.com" className="text-white text-lg lg:text-2xl group-hover:text-cyan-400 transition-colors">andreamcorimayo@gmail.com</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all">
                    <Linkedin size={24} className="lg:w-8 lg:h-8" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base text-slate-500 font-medium uppercase tracking-wide">LinkedIn</p>
                    <a href="#" className="text-white text-lg lg:text-2xl group-hover:text-blue-400 transition-colors">linkedin.com/in/andrea-magali-corimayo/</a>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 border border-slate-700">
                    <MapPin size={24} className="lg:w-8 lg:h-8" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base text-slate-500 font-medium uppercase tracking-wide">Ubicación</p>
                    <span className="text-white text-lg lg:text-2xl">Hurlingham; Buenos Aires; Argentina.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 lg:p-12 border border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="text-center space-y-8 relative z-10">
                <div className="w-20 h-20 lg:w-28 lg:h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
                  <MessageCircle size={40} className="lg:w-12 lg:h-12 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4">Respuesta Rápida</h3>
                  <p className="text-slate-400 text-base lg:text-xl">
                    La forma más directa de contactarme. Generalmente respondo en menos de una hora.
                  </p>
                </div>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 lg:py-6 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg lg:text-2xl"
                >
                  <MessageCircle size={28} />
                  Iniciar Chat en WhatsApp
                </a>
                
                <p className="text-xs lg:text-sm text-slate-500 mt-4">
                  *Al hacer clic se abrirá WhatsApp Web o la App.
                </p>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm lg:text-base">
          <p>© {new Date().getFullYear()} Andrea Corimayo. Diseñado con React & Tailwind.</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;