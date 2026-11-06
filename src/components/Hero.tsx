import React, { useState } from 'react';
import { Heart, Calendar, ArrowDown, Sparkles, Camera } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { resolveAssetUrl } from '../config/anniversaryConfig';

export const Hero: React.FC = () => {
  const { config } = useAnniversary();
  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(config.anniversaryDate).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section id="top" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#ffdada]/30 via-[#f7d6dc]/20 to-transparent blur-3xl -z-10"
      />
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Unboxed Metadata */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#735c00] mb-5">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>Comemoração de Aniversário</span>
          <span aria-hidden="true" className="text-[#867273]">·</span>
          <span>{config.title}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#2a0006] tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6 text-balance">
          {config.coupleNames}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-lg sm:text-xl text-[#544343] max-w-2xl mx-auto leading-relaxed mb-8">
          {config.subtitle}
        </p>

        {/* Unboxed Date & Milestone Separators */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#867273] font-medium mb-10">
          <span className="flex items-center gap-1.5 text-[#4a0e17]">
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            Desde {formattedDate}
          </span>
          <span aria-hidden="true" className="text-[#d9c1c1]">·</span>
          <span>Amor Incondicional</span>
          <span aria-hidden="true" className="text-[#d9c1c1]">·</span>
          <span>Para Toda a Vida</span>
        </div>

        {/* Featured Couple Portrait (Foto da Tela Inicial) */}
        <div className="max-w-xs sm:max-w-sm mx-auto mb-12 relative group">
          <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-xl border-2 border-[#d4af37]/50 relative transition-transform duration-300 hover:scale-[1.02]">
            {/* Ambient gold aura behind photo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/30 to-[#f39c12]/30 rounded-2xl blur-sm -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#eae8e4]">
              {!imageError && config.heroPhoto ? (
                <img
                  src={resolveAssetUrl(config.heroPhoto)}
                  alt="Foto do casal em destaque"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                /* Elegant Placeholder */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#fffdfa] via-[#fbf7f0] to-[#f4ece1] border border-dashed border-[#d4af37]/50">
                  <div className="w-14 h-14 rounded-full bg-[#fdf2f4] border border-[#d4af37] flex items-center justify-center text-[#4a0e17] mb-3 shadow-xs">
                    <Camera className="w-7 h-7 text-[#d4af37]" />
                  </div>
                  <span className="font-serif text-lg font-semibold text-[#2a0006]">
                    Foto de Destaque
                  </span>
                  <span className="text-xs text-[#867273] font-mono mt-1 bg-white/80 px-2 py-0.5 rounded border border-[#d9c1c1]">
                    {config.heroPhoto || '/fotos/foto-01.jpg'}
                  </span>
                  <span className="text-[11px] text-[#735c00] mt-2 italic">
                    Tela Inicial
                  </span>
                </div>
              )}
            </div>
            
            {/* Caption underneath portrait */}
            <div className="pt-3 pb-1 text-center">
              <span className="font-serif italic text-sm text-[#4a0e17] flex items-center justify-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                <span>Nosso Começo & Nossa História</span>
                <Heart className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center mb-14">
          <a
            href="#tempo"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium text-white bg-[#4a0e17] hover:bg-[#6a1b29] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-[#d4af37]/30 transition-all duration-200 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>Nosso Tempo Juntos</span>
          </a>
        </div>

        {/* Romantic Pull Quote Card */}
        <div className="max-w-2xl mx-auto glass-panel rounded-xl p-6 md:p-8 text-center relative border border-[#d4af37]/25 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#fdf2f4] border border-[#d4af37]/40 text-[#4a0e17] flex items-center justify-center mx-auto -mt-10 mb-3 shadow-xs">
            <Heart className="w-4 h-4 fill-[#4a0e17]" />
          </div>
          <p className="font-serif italic text-lg sm:text-xl text-[#2a0006] leading-relaxed mb-2">
            &ldquo;{config.quote}&rdquo;
          </p>
          <span className="text-xs tracking-wider uppercase text-[#867273] font-medium">
            Memória do Nosso Amor
          </span>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#tempo"
            className="text-[#867273] hover:text-[#4a0e17] transition-colors p-2 rounded-full hover:bg-[#eae8e4]/60 animate-bounce"
            aria-label="Rolar para o contador"
          >
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
