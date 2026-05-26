import React from 'react';
import { ProductVisual } from './ProductSVGs';

interface ProductDetailModalProps {
  selectedProduct: any | null;
  supportWhatsAppDigits: string;
  t: any;
  setSelectedProduct: (prod: any | null) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  selectedProduct,
  supportWhatsAppDigits,
  t,
  setSelectedProduct,
}) => {
  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-xl w-full shadow-2xl overflow-hidden relative">
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center font-bold shadow transition"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="bg-slate-50 dark:bg-slate-900 py-14 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
            <ProductVisual
              image={selectedProduct.image}
              className="w-24 h-24"
            />
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest">
                  {selectedProduct.category}
                </span>
                <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 mt-1">
                  {selectedProduct.title}
                </h2>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed font-semibold">
                  {selectedProduct.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed font-medium">
                {selectedProduct.description}
              </p>

              <div className="text-xl font-black text-[#F97316]">
                {selectedProduct.price}{' '}
                <span className="text-sm font-bold">DT</span>
              </div>
            </div>

            {/* Direct Action links */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <a
                href={
                  supportWhatsAppDigits
                    ? `tel:${supportWhatsAppDigits}`
                    : 'tel:+21622456789'
                }
                className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-3 rounded-xl transition text-center shadow flex items-center justify-center gap-1.5"
              >
                <span>{t.call}</span>
              </a>

              <a
                href={`https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
                  `Bonjour, je suis intéressé par l'achat de la pièce d'occasion : ${selectedProduct.title} - ${selectedProduct.price} DT.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-xl transition text-center shadow flex items-center justify-center gap-1.5"
              >
                <span>{t.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailModal;
