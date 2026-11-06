import React from 'react';
import { Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fbf9f5]/85 border-b border-[#d9c1c1]/40 transition-all">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Brand Wordmark */}
        <a
          href="#top"
          className="group flex items-center gap-2 font-serif text-xl sm:text-2xl font-semibold text-[#4a0e17] tracking-tight whitespace-nowrap shrink-0 hover:text-[#6a1b29] transition-colors"
        >
          <Sparkles className="w-5 h-5 text-[#d4af37] transition-transform duration-300 group-hover:rotate-12" />
          <span>Nossa História</span>
        </a>

        {/* Nav Links (Single-Line, Zero Pills) */}
        <nav className="flex items-center gap-5 sm:gap-7 text-xs sm:text-sm font-medium text-[#544343] overflow-x-auto">
          <a
            href="#tempo"
            className="hover:text-[#4a0e17] transition-colors whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#d4af37] hover:after:w-full after:transition-all"
          >
            Nosso Tempo
          </a>
          <a
            href="#galeria"
            className="hover:text-[#4a0e17] transition-colors whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#d4af37] hover:after:w-full after:transition-all"
          >
            Galeria de Memórias
          </a>
          <a
            href="#carta"
            className="hover:text-[#4a0e17] transition-colors whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#d4af37] hover:after:w-full after:transition-all"
          >
            Carta de Amor
          </a>
        </nav>
      </div>
    </header>
  );
};
