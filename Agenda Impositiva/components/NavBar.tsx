import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Briefcase, User, Mail, GitMerge, LayoutDashboard } from 'lucide-react';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#home', icon: <User size={18} /> },
    { name: 'Experiencia', href: '#experience', icon: <Briefcase size={18} /> },
    { name: 'Metodología', href: '#methodology', icon: <GitMerge size={18} /> },
    { name: 'Habilidades', href: '#skills', icon: <LayoutDashboard size={18} /> },
    { name: 'Porfolio', href: '#portfolio', icon: <Code size={18} /> },
    { name: 'Contacto', href: '#contact', icon: <Mail size={18} /> },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 80; // Altura aproximada del navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel shadow-lg py-2' : 'bg-slate-900/90 backdrop-blur-md py-4'}`}>
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="flex justify-between items-center">
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 group-hover:opacity-80 transition-opacity">
              AC
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors relative group"
              >
                {link.icon}
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel absolute w-full border-b border-slate-700 animate-in slide-in-from-top-5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 block px-3 py-3 rounded-lg text-base font-medium transition-colors"
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;