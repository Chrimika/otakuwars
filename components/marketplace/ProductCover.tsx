'use client';

import React from 'react';
import { Product } from '../../data/products';
import { ImpactBurstIcon } from '../ui/icons/OtakuIcons';

export const ProductCover: React.FC<{ product: Product; className?: string }> = ({ product, className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden clip-corner flex items-center justify-center bg-void-2 border ${className}`}
      style={{ borderColor: `${product.accentColor}66` }}
    >
      <div className="manga-halftone opacity-40" />
      <ImpactBurstIcon className="relative w-12 h-12" style={{ color: product.accentColor }} />
    </div>
  );
};
