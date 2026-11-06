import React from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';

export const Footer: React.FC = () => {
  const { config } = useAnniversary();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-[#d9c1c1]/50 bg-[#f5f3ef]/60 py-12 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand & Names */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-serif text-lg font-semibold text-[#4a0e17] mb-1">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>{config.coupleNames}</span>
            </div>
            <p className="text-xs text-[#867273]">
              Celebrando cada dia como o mais especial de nossas vidas.
            </p>
          </div>

          {/* Center Romantic Note */}
          <div className="flex items-center gap-1.5 text-xs text-[#544343]">
            <span>Feito com todo carinho & amor</span>
            <Heart className="w-3.5 h-3.5 fill-[#4a0e17] text-[#4a0e17]" />
            <span>para sempre</span>
          </div>

          {/* Right Actions: Back to top */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full hover:bg-white text-[#867273] hover:text-[#4a0e17] transition-colors cursor-pointer"
              aria-label="Voltar ao início da página"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
