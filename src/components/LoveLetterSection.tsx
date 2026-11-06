import React, { useState } from 'react';
import { Mail, MailOpen, Heart, Sparkles, Check, Copy } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';

export const LoveLetterSection: React.FC = () => {
  const { config } = useAnniversary();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { letter } = config;

  const handleCopy = () => {
    const fullText = `${letter.title}\n\n${letter.salutation}\n\n${letter.paragraphs.join('\n\n')}\n\n${letter.closing}\n${letter.signature}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Recenter view on the envelope
    const cartaElem = document.getElementById('carta');
    if (cartaElem) {
      cartaElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="carta" className="py-20 md:py-28 bg-[#f5f3ef]/40 relative scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-2">
            <Mail className="w-4 h-4 text-[#d4af37]" />
            <span>Palavras do Coração</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2a0006] tracking-tight mb-4">
            Carta de Amor
          </h2>
          <p className="text-sm sm:text-base text-[#544343]">
            Um envelope selado com carinho, guardando os sentimentos mais verdadeiros.
          </p>
        </div>

        {/* Envelope Presentation & Interactive Reveal */}
        <div className="max-w-3xl mx-auto">
          {!isOpen ? (
            /* Closed Vintage Envelope Presentation */
            <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center relative border border-[#d4af37]/35 shadow-lg group hover:border-[#d4af37]/70 transition-all duration-300">
              {/* Decorative Envelope Flap Accent */}
              <div className="w-full max-w-xs mx-auto border-t-2 border-dashed border-[#d9c1c1] mb-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fbf9f5] px-3 text-xs uppercase tracking-widest text-[#867273]">
                  Confidencial & Afetuoso
                </div>
              </div>

              {/* Antique Wax Seal Stamp */}
              <div className="relative inline-block mb-8">
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#4a0e17] text-white flex flex-col items-center justify-center shadow-xl border-4 border-[#d4af37] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group-hover:shadow-[#4a0e17]/25"
                  aria-label="Abrir carta de amor"
                >
                  <Heart className="w-7 h-7 fill-[#d4af37] text-[#d4af37] mb-1 animate-gentle-pulse" />
                  <span className="text-[10px] font-serif font-bold tracking-widest uppercase text-[#ffdada]">
                    Abrir
                  </span>
                </button>
                <div className="absolute -top-1 -right-1 text-[#d4af37] animate-bounce">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2a0006] mb-3">
                {letter.envelopeSealText || 'Para o Meu Amor'}
              </h3>
              <p className="text-sm text-[#544343] max-w-md mx-auto mb-8">
                Clique no selo de cera ou no botão abaixo para desdobrar esta mensagem guardada para você.
              </p>

              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#4a0e17] hover:bg-[#6a1b29] border border-[#d4af37]/40 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MailOpen className="w-4 h-4 text-[#ffdada]" />
                <span>Abrir Carta de Amor</span>
              </button>
            </div>
          ) : (
            /* Open Unfolded Vintage Letter Presentation */
            <div className="relative bg-[#fffdfa] rounded-2xl p-8 sm:p-12 md:p-16 border border-[#d4af37]/35 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
              {/* Vintage Deckle Edge Effect & Top Filigree */}
              <div className="flex items-center justify-between border-b border-[#d4af37]/25 pb-6 mb-8">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#735c00]">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>{letter.dateStamp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4a0e17] bg-[#fdf2f4] hover:bg-[#f7d6dc] rounded-md border border-[#d4af37]/30 transition-colors cursor-pointer"
                    title="Copiar texto da carta"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Carta</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#867273] hover:text-[#4a0e17] hover:bg-[#eae8e4]/60 rounded-md transition-colors cursor-pointer"
                  >
                    <span>Dobrar Carta</span>
                  </button>
                </div>
              </div>

              {/* Letter Heading */}
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2a0006] mb-6 tracking-tight">
                {letter.title}
              </h3>

              {/* Salutation */}
              <p className="font-serif italic text-lg sm:text-xl text-[#4a0e17] mb-6">
                {letter.salutation}
              </p>

              {/* Letter Paragraphs */}
              <div className="space-y-5 text-[#2d1e20] text-base sm:text-lg leading-relaxed font-sans font-normal">
                {letter.paragraphs.map((p, idx) => (
                  <p key={idx} className="first-letter:font-serif first-letter:text-3xl first-letter:text-[#4a0e17] first-letter:mr-1">
                    {p}
                  </p>
                ))}
              </div>

              {/* Filigree Ornamental Divider */}
              <div className="my-8 flex items-center justify-center gap-3 text-[#d4af37]">
                <div className="h-[1px] w-16 bg-[#d4af37]/30" />
                <Heart className="w-4 h-4 fill-[#d4af37]" />
                <div className="h-[1px] w-16 bg-[#d4af37]/30" />
              </div>

              {/* Closing & Handwritten Signature */}
              <div className="text-right pt-2">
                <p className="font-serif italic text-sm sm:text-base text-[#544343] mb-1">
                  {letter.closing}
                </p>
                <p className="font-script text-3xl sm:text-4xl text-[#4a0e17]">
                  {letter.signature}
                </p>
              </div>

              {/* Bottom Re-fold Button */}
              <div className="mt-12 text-center pt-6 border-t border-[#d4af37]/20">
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-[#4a0e17] bg-[#fbf9f5] hover:bg-[#fdf2f4] border border-[#d4af37] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                  <span>Guardar Carta de Volta no Envelope</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
