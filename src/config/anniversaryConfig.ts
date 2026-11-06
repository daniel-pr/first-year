/**
 * ==============================================================================
 * CONFIGURAÇÃO DO SITE "NOSSO PRIMEIRO ANO" - ANIVERSÁRIO DE NAMORO
 * ==============================================================================
 * Todas as informações do casal estão organizadas de forma modular abaixo.
 * 
 * GUIA DE FOTOS (20 FOTOGRAFIAS):
 * 1. As 20 fotos da galeria ficam localizadas na pasta: `public/fotos/`
 * 2. Nomes dos arquivos de imagem:
 *    - `foto-01.jpg` até `foto-20.jpg`
 * 3. Foto da Tela Inicial: definida em `HERO_FEATURED_PHOTO` (padrão: "/fotos/foto-01.jpg")
 * 4. Foto da Surpresa Final: definida em `SURPRISE_FEATURED_PHOTO` (padrão: "/fotos/foto-20.jpg")
 */

export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  date: string;
  location?: string;
  rotation?: number; // Ângulo polaroid orgânico em graus (-1.8 a 1.8)
}

export interface LoveLetterConfig {
  envelopeSealText: string;
  title: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  dateStamp: string;
}

export interface SurpriseConfig {
  badge: string;
  headline: string;
  subheadline: string;
  message: string;
  photoUrl: string; // Foto dedicada para a surpresa final
  promiseList: string[];
  certificateTitle: string;
}

export interface MusicConfig {
  title: string;
  artist: string;
  filePath: string; // Caminho do arquivo MP3 (ex: "/musica/nossa-musica.mp3") ou URL
  loop: boolean;
}

/**
 * Resolve o caminho de áudio de forma dinâmica considerando o base path do Vite (essencial para GitHub Pages).
 */
export function resolveAudioUrl(filePath: string): string {
  if (!filePath) return '';
  if (/^(https?:|data:|blob:|\/\/)/i.test(filePath)) {
    return filePath;
  }
  const clean = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}

export interface AnniversaryConfig {
  title: string;
  coupleNames: string;
  anniversaryDate: string; // Formato ISO com fuso horário de Brasília
  subtitle: string;
  quote: string;
  heroPhoto: string; // Foto em destaque na tela inicial
  surprisePhoto: string; // Foto dedicada na surpresa final
  photos: PhotoMemory[];
  letter: LoveLetterConfig;
  surprise: SurpriseConfig;
  music: MusicConfig;
}

// ------------------------------------------------------------------------------
// 1. DATA E NOMES DO CASAL (7 de novembro de 2025, 18h de Brasília)
// ------------------------------------------------------------------------------
export const COUPLE_NAMES = "Você & Eu";
export const COUPLE_START_DATE = "2025-11-07T18:00:00-03:00";

// ------------------------------------------------------------------------------
// 2. FOTOS DE DESTAQUE: TELA INICIAL & SURPRESA FINAL
// ------------------------------------------------------------------------------
export const HERO_FEATURED_PHOTO = "/fotos/foto-01.jpg";
export const SURPRISE_FEATURED_PHOTO = "/fotos/foto-20.jpg";

// ------------------------------------------------------------------------------
// 3. GALERIA COM AS 20 FOTOS DO CASAL (`public/fotos/foto-01.jpg` a `foto-20.jpg`)
// ------------------------------------------------------------------------------
export const COUPLE_PHOTOS_CONFIG: PhotoMemory[] = [
  { id: "foto-01", url: "/fotos/foto-01.jpg", caption: "Nosso Primeiro Encontro", date: "Momento 01", rotation: -1.5 },
  { id: "foto-02", url: "/fotos/foto-02.jpg", caption: "Mãos Entrelaçadas", date: "Momento 02", rotation: 1.5 },
  { id: "foto-03", url: "/fotos/foto-03.jpg", caption: "Sorriso Espontâneo", date: "Momento 03", rotation: -1.2 },
  { id: "foto-04", url: "/fotos/foto-04.jpg", caption: "Aquele Olhar Especial", date: "Momento 04", rotation: 1.8 },
  { id: "foto-05", url: "/fotos/foto-05.jpg", caption: "Nossa Primeira Viagem", date: "Momento 05", rotation: -1.7 },
  { id: "foto-06", url: "/fotos/foto-06.jpg", caption: "Tarde com Amor e Paz", date: "Momento 06", rotation: 1.2 },
  { id: "foto-07", url: "/fotos/foto-07.jpg", caption: "Almoço Especial a Dois", date: "Momento 07", rotation: -1.4 },
  { id: "foto-08", url: "/fotos/foto-08.jpg", caption: "O Melhor Abraço do Mundo", date: "Momento 08", rotation: 1.6 },
  { id: "foto-09", url: "/fotos/foto-09.jpg", caption: "Passeio Inesquecível", date: "Momento 09", rotation: -1.8 },
  { id: "foto-10", url: "/fotos/foto-10.jpg", caption: "Brinde ao Nosso Amor", date: "Momento 10", rotation: 1.4 },
  { id: "foto-11", url: "/fotos/foto-11.jpg", caption: "Cumplicidade de Todos os Dias", date: "Momento 11", rotation: -1.3 },
  { id: "foto-12", url: "/fotos/foto-12.jpg", caption: "Risadas sem Fim", date: "Momento 12", rotation: 1.7 },
  { id: "foto-13", url: "/fotos/foto-13.jpg", caption: "Pôr do Sol Perfeito", date: "Momento 13", rotation: -1.5 },
  { id: "foto-14", url: "/fotos/foto-14.jpg", caption: "Conversas que Curam", date: "Momento 14", rotation: 1.3 },
  { id: "foto-15", url: "/fotos/foto-15.jpg", caption: "Caminhando Lado a Lado", date: "Momento 15", rotation: -1.6 },
  { id: "foto-16", url: "/fotos/foto-16.jpg", caption: "Sob a Luz das Estrelas", date: "Momento 16", rotation: 1.5 },
  { id: "foto-17", url: "/fotos/foto-17.jpg", caption: "Aconchego do Nosso Lar", date: "Momento 17", rotation: -1.2 },
  { id: "foto-18", url: "/fotos/foto-18.jpg", caption: "Pequenos Gestos Preciosos", date: "Momento 18", rotation: 1.8 },
  { id: "foto-19", url: "/fotos/foto-19.jpg", caption: "Sonhos que Construímos Juntos", date: "Momento 19", rotation: -1.4 },
  { id: "foto-20", url: "/fotos/foto-20.jpg", caption: "Nossa Memória Eterna", date: "Momento 20", rotation: 1.5 },
];

// ------------------------------------------------------------------------------
// 4. CARTA DE AMOR
// ------------------------------------------------------------------------------
export const LOVE_LETTER_CONFIG: LoveLetterConfig = {
  envelopeSealText: "Para o Meu Amor",
  title: "Uma Carta para Guardar no Coração",
  salutation: "Meu amor,",
  paragraphs: [
    "Hoje, ao olhar para trás e ver cada passo que demos juntos, sinto uma gratidão que as palavras mal conseguem descrever. O tempo ao seu lado parece ter uma magia própria: voa nos momentos alegres e congela quando me perco no seu olhar.",
    "Cada detalhe da nossa rotina se tornou precioso. As conversas sem pressa ao entardecer, os planos para o futuro traçados na ponta dos dedos, o seu riso que acalma qualquer tempestade. Você transformou a minha vida em um lugar muito mais bonito, seguro e cheio de paz.",
    "Obrigado por ser meu porto seguro, meu melhor abraço e o amor mais sincero que já conheci. Que este aniversário seja apenas uma vírgula bonita na história eterna que estamos escrevendo juntos."
  ],
  closing: "Com todo o meu amor e carinho,",
  signature: "Para sempre ao seu lado.",
  dateStamp: "Com amor, hoje e sempre",
};

// ------------------------------------------------------------------------------
// 5. SURPRESA FINAL
// ------------------------------------------------------------------------------
export const SURPRISE_CONFIG: SurpriseConfig = {
  badge: "Nossa Celebração",
  headline: "O Nosso Amor em Cada Batimento",
  subheadline: "Uma homenagem dedicada a celebrar cada detalhe inesquecível da nossa união.",
  message: "Você é a melhor escolha que faço todos os dias. Meu coração é seu ontem, hoje e por todos os amanhãs que virão.",
  photoUrl: SURPRISE_FEATURED_PHOTO,
  promiseList: [
    "Prometo segurar a sua mão em todos os caminhos que percorrermos.",
    "Prometo rir das suas piadas e cuidar de você nos dias difíceis.",
    "Prometo sonhar os mesmos sonhos e construir o nosso futuro lado a lado.",
    "Prometo te amar com toda a ternura e respeito que você merece, todos os dias."
  ],
  certificateTitle: "Certificado do Nosso Amor",
};

// ------------------------------------------------------------------------------
// 6. MÚSICA DO CASAL (Arquivo MP3 local: /public/musica/nossa-musica.mp3)
// ------------------------------------------------------------------------------
export const COUPLE_MUSIC_CONFIG: MusicConfig = {
  title: "Nossa Canção Especial",
  artist: "Nossa Música de Amor",
  filePath: "/musica/nossa-musica.mp3",
  loop: true,
};

// Configuração padrão completa
export const defaultAnniversaryConfig: AnniversaryConfig = {
  title: "Nosso Primeiro Ano",
  coupleNames: COUPLE_NAMES,
  anniversaryDate: COUPLE_START_DATE,
  subtitle: "Celebrando cada segundo, cada sorriso e cada capítulo da nossa história.",
  quote: "O amor não se conta em dias, mas nos momentos que tiram o fôlego.",
  heroPhoto: HERO_FEATURED_PHOTO,
  surprisePhoto: SURPRISE_FEATURED_PHOTO,
  photos: COUPLE_PHOTOS_CONFIG,
  letter: LOVE_LETTER_CONFIG,
  surprise: SURPRISE_CONFIG,
  music: COUPLE_MUSIC_CONFIG,
};
