import React, { useState } from 'react';
import { X, Save, RotateCcw, Upload, Plus, Trash2, Sliders, Calendar, Music, Image as ImageIcon, FileText, Check, Download, Star } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { AnniversaryConfig, PhotoMemory, resolveAssetUrl } from '../config/anniversaryConfig';

export const CustomizerModal: React.FC = () => {
  const { config, updateConfig, resetToDefaults, isCustomizing, setIsCustomizing } = useAnniversary();

  // Local draft state while modal is open
  const [draft, setDraft] = useState<AnniversaryConfig>(config);
  const [activeTab, setActiveTab] = useState<'geral' | 'fotos' | 'carta' | 'musica'>('geral');
  const [saveToast, setSaveToast] = useState(false);
  const [exportJsonToast, setExportJsonToast] = useState(false);

  // Keep draft in sync when modal opens
  React.useEffect(() => {
    if (isCustomizing) {
      setDraft(config);
    }
  }, [isCustomizing, config]);

  if (!isCustomizing) return null;

  const handleSave = () => {
    updateConfig(() => draft);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setIsCustomizing(false);
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza de que deseja restaurar as informações originais?')) {
      resetToDefaults();
      setIsCustomizing(false);
    }
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(draft, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setExportJsonToast(true);
    setTimeout(() => setExportJsonToast(false), 2500);
  };

  // Photo handlers
  const handlePhotoChange = (idx: number, field: keyof PhotoMemory, val: string | number) => {
    const newPhotos = [...draft.photos];
    newPhotos[idx] = { ...newPhotos[idx], [field]: val };
    setDraft({ ...draft, photos: newPhotos });
  };

  const handleFileUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handlePhotoChange(idx, 'url', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = () => {
    if (draft.photos.length >= 20) {
      alert('A galeria suporta até 20 fotos.');
      return;
    }
    const nextNum = draft.photos.length + 1;
    const formattedNum = String(nextNum).padStart(2, '0');
    const newPhoto: PhotoMemory = {
      id: `foto-${formattedNum}`,
      url: `/fotos/foto-${formattedNum}.jpg`,
      caption: `Momento Especial ${formattedNum}`,
      date: `Momento ${formattedNum}`,
      rotation: draft.photos.length % 2 === 0 ? -1.5 : 1.5,
    };
    setDraft({ ...draft, photos: [...draft.photos, newPhoto] });
  };

  const handleRemovePhoto = (idx: number) => {
    if (draft.photos.length <= 1) {
      alert('Mantenha pelo menos uma foto na galeria.');
      return;
    }
    const newPhotos = draft.photos.filter((_, i) => i !== idx);
    setDraft({ ...draft, photos: newPhotos });
  };

  // Convert date format for <input type="datetime-local" />
  const getDatetimeLocalValue = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return '';
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const handleDateChange = (val: string) => {
    if (val) {
      const date = new Date(val);
      setDraft({ ...draft, anniversaryDate: date.toISOString() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#fbf9f5] rounded-2xl shadow-2xl border border-[#d4af37]/40 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#d9c1c1]/50 bg-white/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#4a0e17]" />
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#2a0006]">
                Personalizar Aniversário
              </h3>
              <p className="text-xs text-[#867273]">
                Altere datas, 20 fotos locais, destaques de capa e surpresa, carta e música.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomizing(false)}
            className="p-1.5 text-[#867273] hover:text-[#4a0e17] rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-[#f5f3ef]/80 border-b border-[#d9c1c1]/40 flex gap-2 overflow-x-auto">
          {[
            { id: 'geral', label: 'Geral & Destaques', icon: Calendar },
            { id: 'fotos', label: `Galeria (${draft.photos.length}/20)`, icon: ImageIcon },
            { id: 'carta', label: 'Carta de Amor', icon: FileText },
            { id: 'musica', label: 'Música', icon: Music },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#fbf9f5] text-[#4a0e17] border-t-2 border-[#4a0e17] font-semibold'
                    : 'text-[#544343] hover:text-[#2a0006] hover:bg-white/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: GERAL & DESTAQUES */}
          {activeTab === 'geral' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1.5">
                  Nomes do Casal / Título Principal
                </label>
                <input
                  type="text"
                  value={draft.coupleNames}
                  onChange={(e) => setDraft({ ...draft, coupleNames: e.target.value })}
                  placeholder="Ex: Você & Eu, ou Lucas & Mariana"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d9c1c1] bg-white text-sm text-[#2d1e20] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1.5">
                  Data e Hora de Início do Namoro
                </label>
                <input
                  type="datetime-local"
                  value={getDatetimeLocalValue(draft.anniversaryDate)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d9c1c1] bg-white text-sm text-[#2d1e20] focus:border-[#d4af37] focus:outline-none"
                />
                <p className="text-xs text-[#867273] mt-1">
                  Referência oficial configurada: 7 de novembro de 2025, às 18:00 (Horário de Brasília).
                </p>
              </div>

              {/* Escolha da Foto da Tela Inicial e Foto da Surpresa Final */}
              <div className="p-4 rounded-xl bg-white border border-[#d4af37]/40 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4a0e17]">
                  <Star className="w-4 h-4 text-[#d4af37]" />
                  <span>Escolha de Fotos em Destaque</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Foto da Tela Inicial */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#544343]">
                      Foto da Tela Inicial (Hero):
                    </label>
                    <select
                      value={draft.heroPhoto}
                      onChange={(e) => setDraft({ ...draft, heroPhoto: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#d9c1c1] bg-[#fbf9f5] text-[#2d1e20]"
                    >
                      {draft.photos.map((p, idx) => (
                        <option key={p.id || idx} value={p.url}>
                          Foto {String(idx + 1).padStart(2, '0')} ({p.url})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={draft.heroPhoto}
                      onChange={(e) => setDraft({ ...draft, heroPhoto: e.target.value })}
                      placeholder="Ou digite o caminho da foto"
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d9c1c1] bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1.5">
                  Subtítulo de Boas-vindas
                </label>
                <input
                  type="text"
                  value={draft.subtitle}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d9c1c1] bg-white text-sm text-[#2d1e20] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1.5">
                  Frase Romântica / Citação em Destaque
                </label>
                <textarea
                  rows={2}
                  value={draft.quote}
                  onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d9c1c1] bg-white text-sm text-[#2d1e20] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: FOTOS DA GALERIA (20 FOTOGRAFIAS) */}
          {activeTab === 'fotos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#2a0006]">
                    Fotos da Galeria ({draft.photos.length} de 20)
                  </h4>
                  <p className="text-xs text-[#867273]">
                    Utilize os arquivos <code className="text-[#4a0e17]">foto-01.jpg</code> até <code className="text-[#4a0e17]">foto-20.jpg</code> na pasta <code className="text-[#4a0e17]">public/fotos/</code>.
                  </p>
                </div>
                {draft.photos.length < 20 && (
                  <button
                    onClick={handleAddPhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#4a0e17] hover:bg-[#6a1b29] rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Foto</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.photos.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    className="p-4 rounded-xl border border-[#d9c1c1]/60 bg-white space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#735c00] uppercase tracking-wider">
                        Foto #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-1">
                        {photo.url === draft.heroPhoto && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#fdf2f4] text-[#4a0e17] border border-[#d4af37]/40">
                            Tela Inicial
                          </span>
                        )}
                        <button
                          onClick={() => handleRemovePhoto(idx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-sm cursor-pointer ml-1"
                          title="Remover foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preview Thumbnail */}
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-[#eae8e4] shrink-0 border border-[#d9c1c1] flex items-center justify-center">
                        <img
                          src={resolveAssetUrl(photo.url)}
                          alt={photo.caption}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#4a0e17] bg-[#fdf2f4] hover:bg-[#f7d6dc] rounded-md border border-[#d4af37]/30 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Enviar Arquivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(idx, e)}
                          />
                        </label>
                        <input
                          type="text"
                          value={photo.url}
                          onChange={(e) => handlePhotoChange(idx, 'url', e.target.value)}
                          placeholder="/fotos/foto-XX.jpg"
                          className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d9c1c1] bg-[#fbf9f5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#867273] mb-1">Legenda (visível ao ampliar):</label>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => handlePhotoChange(idx, 'caption', e.target.value)}
                        placeholder="Legenda da foto"
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d9c1c1] bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={photo.date}
                        onChange={(e) => handlePhotoChange(idx, 'date', e.target.value)}
                        placeholder="Momento (ex: Momento 01)"
                        className="text-xs px-2.5 py-1.5 rounded border border-[#d9c1c1] bg-white"
                      />
                      <input
                        type="text"
                        value={photo.location || ''}
                        onChange={(e) => handlePhotoChange(idx, 'location', e.target.value)}
                        placeholder="Local (opcional)"
                        className="text-xs px-2.5 py-1.5 rounded border border-[#d9c1c1] bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CARTA DE AMOR */}
          {activeTab === 'carta' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1">
                    Texto no Selo do Envelope
                  </label>
                  <input
                    type="text"
                    value={draft.letter.envelopeSealText}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        letter: { ...draft.letter, envelopeSealText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d9c1c1] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1">
                    Carimbo de Data / Dedicatória
                  </label>
                  <input
                    type="text"
                    value={draft.letter.dateStamp}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        letter: { ...draft.letter, dateStamp: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d9c1c1] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1">
                  Título da Carta
                </label>
                <input
                  type="text"
                  value={draft.letter.title}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      letter: { ...draft.letter, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#d9c1c1] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1">
                  Saudação Inicial
                </label>
                <input
                  type="text"
                  value={draft.letter.salutation}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      letter: { ...draft.letter, salutation: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#d9c1c1] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1">
                  Parágrafos da Carta (um por bloco)
                </label>
                {draft.letter.paragraphs.map((p, idx) => (
                  <textarea
                    key={idx}
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const newP = [...draft.letter.paragraphs];
                      newP[idx] = e.target.value;
                      setDraft({
                        ...draft,
                        letter: { ...draft.letter, paragraphs: newP },
                      });
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d9c1c1] bg-white mb-2"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1">
                    Despedida
                  </label>
                  <input
                    type="text"
                    value={draft.letter.closing}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        letter: { ...draft.letter, closing: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d9c1c1] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1">
                    Assinatura
                  </label>
                  <input
                    type="text"
                    value={draft.letter.signature}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        letter: { ...draft.letter, signature: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d9c1c1] bg-white font-script text-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MÚSICA DO CASAL (MP3) */}
          {activeTab === 'musica' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-1.5">
                  Música Personalizada (MP3)
                </label>
                <p className="text-xs text-[#544343] mb-4">
                  O site reproduz diretamente o arquivo MP3 do casal hospedado no projeto em <code className="text-[#4a0e17] bg-white px-1.5 py-0.5 rounded border border-[#d9c1c1]">public/musica/nossa-musica.mp3</code>, funcionando 100% no GitHub Pages.
                </p>

                <div className="p-4 rounded-xl border border-[#d9c1c1] bg-white space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#544343] mb-1">
                      Título da Canção
                    </label>
                    <input
                      type="text"
                      value={draft.music.title}
                      onChange={(e) => setDraft({
                        ...draft,
                        music: { ...draft.music, title: e.target.value }
                      })}
                      placeholder="Ex: Nossa Canção Especial"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#d9c1c1] bg-[#fbf9f5] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#544343] mb-1">
                      Artista / Dedicatória
                    </label>
                    <input
                      type="text"
                      value={draft.music.artist}
                      onChange={(e) => setDraft({
                        ...draft,
                        music: { ...draft.music, artist: e.target.value }
                      })}
                      placeholder="Ex: Nossa Música de Amor"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#d9c1c1] bg-[#fbf9f5] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#544343] mb-1">
                      Caminho do Arquivo de Áudio
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={draft.music.filePath}
                        onChange={(e) => setDraft({
                          ...draft,
                          music: { ...draft.music, filePath: e.target.value }
                        })}
                        placeholder="/musica/nossa-musica.mp3"
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#d9c1c1] bg-[#fbf9f5] focus:bg-white font-mono"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#4a0e17] bg-[#fdf2f4] hover:bg-[#f7d6dc] rounded-lg border border-[#d4af37]/30 cursor-pointer transition-colors whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Carregar MP3</span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setDraft({
                                    ...draft,
                                    music: {
                                      ...draft.music,
                                      filePath: event.target.result as string,
                                      title: file.name.replace(/\.[^/.]+$/, ''),
                                    }
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-[#867273] mt-1.5">
                      Padrão para publicação no GitHub Pages: <code className="text-[#4a0e17]">/musica/nossa-musica.mp3</code>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#d9c1c1]/50 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-[#2d1e20] block">Repetir Música em Loop</span>
                      <span className="text-[11px] text-[#867273]">Reinicia a canção automaticamente ao terminar</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.music.loop}
                        onChange={(e) => setDraft({
                          ...draft,
                          music: { ...draft.music, loop: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4a0e17]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-[#d9c1c1]/50 bg-white/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#867273] hover:text-[#4a0e17] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#735c00] hover:text-[#4a0e17] transition-colors cursor-pointer"
              title="Copiar configuração em JSON para salvar no código-fonte"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportJsonToast ? 'Copiado para Área de Transferência!' : 'Copiar Config JSON'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCustomizing(false)}
              className="px-4 py-2 text-xs font-medium text-[#544343] hover:text-[#2a0006] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#4a0e17] hover:bg-[#6a1b29] rounded-lg shadow-sm hover:-translate-y-0.5 border border-[#d4af37]/40 transition-all cursor-pointer"
            >
              {saveToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
