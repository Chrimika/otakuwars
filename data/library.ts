export type LibraryCategory = 'shonen' | 'seinen' | 'isekai' | 'historique' | 'sci-fi';

export interface LibraryWork {
  id: string;
  title: string;
  author: string;
  country: string;
  category: LibraryCategory;
  synopsis: string;
  isFree: boolean;
  price?: number; // en FCFA
  pages: number;
  accentColor: string;
}

export const LIBRARY_CATEGORY_LABEL: Record<LibraryCategory, string> = {
  shonen: 'Shonen',
  seinen: 'Seinen',
  isekai: 'Isekai',
  historique: 'Historique',
  'sci-fi': 'Science-fiction',
};

export const LIBRARY_WORKS: LibraryWork[] = [
  {
    id: 'w1',
    title: 'Wakanda Blade',
    author: 'A. Mbeki',
    country: 'Cameroun',
    category: 'shonen',
    synopsis: 'Un jeune guerrier découvre un pouvoir ancestral pour défendre son village des envahisseurs venus d\'outre-mer.',
    isFree: true,
    pages: 24,
    accentColor: '#ff1f3d',
  },
  {
    id: 'w2',
    title: 'Les Chroniques de Sahel',
    author: 'F. Diallo',
    country: 'Sénégal',
    category: 'historique',
    synopsis: 'Fresque historique sur les grands royaumes du Sahel, entre diplomatie, magie et guerre.',
    isFree: false,
    price: 1500,
    pages: 40,
    accentColor: '#ffb020',
  },
  {
    id: 'w3',
    title: 'Isekai Kinshasa',
    author: 'J. Kalonji',
    country: 'RD Congo',
    category: 'isekai',
    synopsis: 'Un développeur congolais se réveille dans un monde parallèle inspiré du folklore local.',
    isFree: false,
    price: 1000,
    pages: 32,
    accentColor: '#8b5cf6',
  },
  {
    id: 'w4',
    title: 'Cyber Abidjan 2099',
    author: 'N. Koffi',
    country: 'Côte d\'Ivoire',
    category: 'sci-fi',
    synopsis: 'Dans une Abidjan futuriste, une hackeuse otaku affronte des corporations qui contrôlent la ville.',
    isFree: true,
    pages: 28,
    accentColor: '#ff2e88',
  },
  {
    id: 'w5',
    title: 'Griot Seinen',
    author: 'A. Traoré',
    country: 'Mali',
    category: 'seinen',
    synopsis: 'Récit mature sur un griot moderne qui raconte la mémoire de son peuple à travers des duels de mots.',
    isFree: false,
    price: 2000,
    pages: 36,
    accentColor: '#ffb020',
  },
  {
    id: 'w6',
    title: 'Otaku de Douala',
    author: 'S. Nkolo',
    country: 'Cameroun',
    category: 'shonen',
    synopsis: 'La vie quotidienne (et pas si tranquille) d\'un club otaku dans un lycée de Douala.',
    isFree: true,
    pages: 20,
    accentColor: '#ff1f3d',
  },
  {
    id: 'w7',
    title: 'Royaume Bantou',
    author: 'P. Essomba',
    country: 'Gabon',
    category: 'historique',
    synopsis: 'Une princesse bantoue forme une alliance de guerriers pour reconquérir son trône.',
    isFree: false,
    price: 1800,
    pages: 44,
    accentColor: '#8b5cf6',
  },
  {
    id: 'w8',
    title: 'Portail de Kribi',
    author: 'L. Ateba',
    country: 'Cameroun',
    category: 'isekai',
    synopsis: 'Sur la plage de Kribi, un portail mystérieux aspire trois amis dans un monde peuplé d\'esprits marins.',
    isFree: true,
    pages: 26,
    accentColor: '#00c2d1',
  },
];
