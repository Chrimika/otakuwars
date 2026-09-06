'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PRODUCTS, PRODUCT_CATEGORY_LABEL } from '../../../data/products';
import { ProductCover } from '../../../components/marketplace/ProductCover';
import { Panel } from '../../../components/ui/Panel';
import { NeonButton } from '../../../components/ui/NeonButton';
import { ScrollIcon } from '../../../components/ui/icons/OtakuIcons';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === params.id);
  const [ordered, setOrdered] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!product) return;
    setOrdered(localStorage.getItem(`otakuwars_order_${product.id}`) === '1');
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 mb-4">Produit introuvable.</p>
        <Link href="/boutique" className="text-crimson underline">Retour à la boutique</Link>
      </div>
    );
  }

  const handleBuy = () => {
    setBuying(true);
    setTimeout(() => {
      localStorage.setItem(`otakuwars_order_${product.id}`, '1');
      setOrdered(true);
      setBuying(false);
    }, 600);
  };

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/boutique" className="inline-flex items-center gap-1.5 mb-6 text-xs text-slate-500 hover:text-crimson transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour à la boutique
      </Link>

      <div className="grid sm:grid-cols-[280px_1fr] gap-8">
        <ProductCover product={product} className="aspect-square w-full" />

        <div>
          <span className="inline-block text-[10px] font-hud font-bold uppercase tracking-wider text-neon-gold bg-neon-gold/10 border border-neon-gold/30 px-2 py-1 mb-3">
            {PRODUCT_CATEGORY_LABEL[product.category]}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink mb-3">{product.name}</h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">{product.description}</p>

          {ordered ? (
            <div className="flex items-center gap-2 p-4 clip-corner-sm bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-sm max-w-sm">
              <Check className="w-4 h-4 shrink-0" /> Commande enregistrée, merci pour ton soutien !
            </div>
          ) : (
            <Panel glow="gold" className="p-5 max-w-sm">
              <p className="text-2xl font-display text-white mb-3">{product.price.toLocaleString('fr-FR')} FCFA</p>
              <NeonButton variant="primary" onClick={handleBuy} disabled={buying} className="w-full bg-neon-gold!">
                <ShoppingCart className="w-4 h-4" />
                {buying ? 'Traitement...' : 'Commander'}
              </NeonButton>
              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <ScrollIcon className="w-3 h-3" />
                Démo : aucun paiement réel n&apos;est traité.
              </p>
            </Panel>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-base font-hud font-bold uppercase tracking-wide text-white mb-5">Produits similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/boutique/${p.id}`} className="group block">
                <ProductCover product={p} className="aspect-square mb-2 group-hover:brightness-110 transition-all" />
                <p className="text-xs font-bold text-white truncate">{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
