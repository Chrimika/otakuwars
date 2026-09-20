export type ProductCategory = 'vetement' | 'figurine' | 'poster' | 'accessoire';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // en FCFA
  description: string;
  accentColor: string;
}

export const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
  vetement: 'Vêtement',
  figurine: 'Figurine',
  poster: 'Poster',
  accessoire: 'Accessoire',
};

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'T-shirt Otaku Wars',
    category: 'vetement',
    price: 8000,
    description: 'T-shirt coton, logo Otaku Wars floqué à l\'encre crimson, coupe unisexe.',
    accentColor: '#ff1f3d',
  },
  {
    id: 'p2',
    name: 'Figurine Katana Stamp',
    category: 'figurine',
    price: 15000,
    description: 'Figurine collector inspirée de l\'emblème katana de la plateforme.',
    accentColor: '#ffb020',
  },
  {
    id: 'p3',
    name: 'Poster Quiz Otaku',
    category: 'poster',
    price: 4000,
    description: 'Affiche A2 façon planche manga, édition limitée numérotée.',
    accentColor: '#8b5cf6',
  },
  {
    id: 'p4',
    name: 'Porte-clés Torii',
    category: 'accessoire',
    price: 2500,
    description: 'Porte-clés métal en forme de torii, symbole de la communauté.',
    accentColor: '#ff2e88',
  },
  {
    id: 'p5',
    name: 'Casquette Otaku Wars',
    category: 'vetement',
    price: 7000,
    description: 'Casquette brodée, logo katana sur le devant.',
    accentColor: '#ff1f3d',
  },
  {
    id: 'p6',
    name: 'Mug Impact Burst',
    category: 'accessoire',
    price: 3500,
    description: 'Mug céramique avec l\'éclat d\'impact de la plateforme.',
    accentColor: '#ffb020',
  },
  {
    id: 'p7',
    name: 'Figurine Oni Mask',
    category: 'figurine',
    price: 18000,
    description: 'Figurine du masque oni, symbole de la mascotte Otaku Wars.',
    accentColor: '#ff1f3d',
  },
  {
    id: 'p8',
    name: 'Tote Bag Arène',
    category: 'accessoire',
    price: 5000,
    description: 'Tote bag en toile résistante, motif halftone crimson.',
    accentColor: '#8b5cf6',
  },
];
