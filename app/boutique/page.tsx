'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, PRODUCT_CATEGORY_LABEL, ProductCategory } from '../../data/products';
import { ProductCover } from '../../components/marketplace/ProductCover';
import { KatanaIcon } from '../../components/ui/icons/OtakuIcons';
import { GamingGlyphsWatermark } from '../../components/ui/GamingGlyphsWatermark';

export default function BoutiquePage() {
  const [filter, setFilter] = useState<ProductCategory | 'tous'>('tous');
  const products = filter === 'tous' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="manga-halftone opacity-60" />
        <GamingGlyphsWatermark />
        <div className="relative max-w-4xl mx-auto px-4 pt-14 pb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 clip-corner-sm bg-crimson/10 border border-crimson/40 text-crimson text-xs font-hud font-bold uppercase tracking-wider mb-5">
            <KatanaIcon className="w-3.5 h-3.5" />
            Goodies otaku
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-ink mb-4">Boutique</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Vêtements, figurines, posters et accessoires aux couleurs de l&apos;arène.
          </p>
        </div>
      </div>
      <div className="torn-edge" />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {(['tous', 'vetement', 'figurine', 'poster', 'accessoire'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 clip-corner-sm text-xs font-hud font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                filter === c
                  ? 'bg-crimson text-white border-crimson'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {c === 'tous' ? 'Tous' : PRODUCT_CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/boutique/${product.id}`} className="group block">
              <ProductCover product={product} className="aspect-square mb-3 group-hover:brightness-110 transition-all" />
              <p className="font-bold text-white text-sm truncate">{product.name}</p>
              <p className="text-xs text-neon-gold font-hud font-bold">{product.price.toLocaleString('fr-FR')} FCFA</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
