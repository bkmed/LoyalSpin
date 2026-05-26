import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  toggleFavoriteAction,
  type Product,
} from '../../../store/slices/partsSlice';
import { useToast } from '../../../context/ToastContext';

interface MarketplaceScreenProps {
  t: any;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const ProductVisual = ({
  image,
  className = 'w-16 h-16',
}: {
  image: string;
  className?: string;
}) => {
  if (image === 'faucet') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M25 80 h50" strokeWidth="4" stroke="#475569" />
        <path
          d="M40 80 V42 c0 -12 8 -22 22 -22 h8"
          strokeWidth="6"
          stroke="#64748B"
        />
        <path d="M70 20 v8" strokeWidth="5" stroke="#94A3B8" />
        <path d="M66 28 h8" strokeWidth="2" stroke="#475569" />
        <path d="M32 50 h12" strokeWidth="4.5" stroke="#334155" />
        <circle cx="32" cy="50" r="3.5" fill="#EF4444" />
        <circle cx="44" cy="50" r="3.5" fill="#3B82F6" />
        <path
          d="M43 35 c0 -5 5 -10 10 -10"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    );
  }
  if (image === 'boiler') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="25"
          y="15"
          width="50"
          height="66"
          rx="6"
          fill="#F8FAFC"
          stroke="#334155"
          strokeWidth="3"
        />
        <rect x="42" y="24" width="16" height="4" rx="1" fill="#1E3A5F" />
        <rect
          x="38"
          y="55"
          width="24"
          height="12"
          rx="2"
          fill="#0F172A"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <circle cx="44" cy="72" r="2.5" fill="#64748B" />
        <circle cx="56" cy="72" r="2.5" fill="#64748B" />
        <path d="M35 81 v10" stroke="#B45309" strokeWidth="4.5" />
        <path d="M50 81 v10" stroke="#CBD5E1" strokeWidth="4" />
        <path d="M65 81 v10" stroke="#B45309" strokeWidth="4.5" />
        <circle cx="35" cy="86" r="3.5" fill="#EF4444" />
        <circle cx="65" cy="86" r="3.5" fill="#06B6D4" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M22 28 h32 v32"
        stroke="#EA580C"
        strokeWidth="8"
        strokeLinecap="square"
      />
      <circle cx="22" cy="28" r="5" fill="#C2410C" />
      <circle cx="54" cy="60" r="5" fill="#C2410C" />
      <path d="M52 35 h32 M68 35 v30" stroke="#EA580C" strokeWidth="7" />
      <circle cx="52" cy="35" r="4.5" fill="#C2410C" />
      <circle cx="84" cy="35" r="4.5" fill="#C2410C" />
      <circle cx="68" cy="65" r="4.5" fill="#C2410C" />
      <rect
        x="30"
        y="72"
        width="28"
        height="10"
        rx="1.5"
        fill="#EA580C"
        stroke="#C2410C"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const MarketplaceScreen = ({
  t,
  setSelectedProduct,
}: MarketplaceScreenProps) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const products = useSelector((state: RootState) => state.parts.listings);
  const favorites = useSelector((state: RootState) => state.parts.favorites);
  const reduxCategories = useSelector(
    (state: RootState) => state.categories.items,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState('Toutes');
  const [selectedConditionFilter, setSelectedConditionFilter] =
    useState('Tous');
  const [priceMax, setPriceMax] = useState(600);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(
    () =>
      products.filter(product => {
        const matchesQuery = searchQuery
          ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesCategory =
          selectedCategoryFilter === 'Toutes' ||
          product.category === selectedCategoryFilter;
        const matchesState =
          selectedConditionFilter === 'Tous' ||
          product.condition.toLowerCase() ===
            selectedConditionFilter.toLowerCase();
        const matchesPrice = product.price <= priceMax;
        return matchesQuery && matchesCategory && matchesState && matchesPrice;
      }),
    [
      products,
      searchQuery,
      selectedCategoryFilter,
      selectedConditionFilter,
      priceMax,
    ],
  );

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [filteredProducts, sortBy]);

  const toggleFavorite = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    dispatch(toggleFavoriteAction(id));
    if (favorites.includes(id)) {
      showToast(tCommon('web.favoriteRemoved', 'Retiré des favoris'), 'info');
    } else {
      showToast(
        tCommon('web.favoriteAdded', 'Ajouté aux favoris !'),
        'success',
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t.pieces}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-semibold">
            {tCommon(
              'web.marketplaceIntro',
              "Recherchez et filtrez nos pièces de rechange de plomberie d'occasion certifiées.",
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
            {t.tri} :
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-850 dark:text-slate-250 focus:outline-none"
          >
            <option value="featured">{t.recommande}</option>
            <option value="price_asc">{t.prix_croissant}</option>
            <option value="price_desc">{t.prix_decroissant}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider">
              {t.filtres}
            </h3>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                {t.rechercher}
              </label>
              <input
                type="text"
                placeholder={tCommon(
                  'web.marketplaceSearchPlaceholder',
                  'Grohe, boiler, radiateur...',
                )}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                Catégories
              </label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('Toutes')}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedCategoryFilter === 'Toutes'
                      ? 'bg-[#1E3A5F] text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  {t.toutes_categories}
                </button>
                {reduxCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat.name)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      selectedCategoryFilter === cat.name
                        ? 'bg-[#1E3A5F] text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                {t.etat}
              </label>
              <div className="grid grid-cols-2 gap-2 text-center">
                {['Tous', 'comme neuf', 'bon état', 'pour pièces'].map(cond => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setSelectedConditionFilter(cond)}
                    className={`px-2 py-2 rounded-xl border text-[10px] font-black capitalize transition leading-none ${
                      selectedConditionFilter === cond
                        ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-350'
                    }`}
                  >
                    {cond === 'Tous' ? t.tous : cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{t.prix} Max</span>
                <span className="text-[#F97316]">{priceMax} DT</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          {sortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm">
              <p className="text-sm text-slate-400 font-bold">
                {t.aucun_produit}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {sortedProducts.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-[#1E3A5F] dark:hover:border-slate-500 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
                >
                  <div className="bg-slate-50 dark:bg-slate-900 py-10 flex items-center justify-center border-b border-slate-100 dark:border-slate-800 relative">
                    <span className="absolute top-3 right-3 z-10 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-350 text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      {prod.condition}
                    </span>

                    <button
                      onClick={e => toggleFavorite(prod.id, e)}
                      className="absolute top-3 left-3 z-10 w-8 h-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={
                          favorites.includes(prod.id) ? 'currentColor' : 'none'
                        }
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className={
                          favorites.includes(prod.id) ? 'text-rose-500' : ''
                        }
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    <ProductVisual image={prod.image} />
                  </div>

                  <div className="p-4 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider">
                        {prod.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-100 mt-1 leading-tight group-hover:text-[#F97316] transition-colors">
                        {prod.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 line-clamp-1 font-semibold">
                        {prod.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-750 pt-3 mt-4">
                      <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-250">
                        {prod.price}{' '}
                        <span className="text-[9.5px] font-bold">DT</span>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedProduct(prod);
                        }}
                        className="bg-[#1E3A5F] hover:bg-[#152a47] text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition"
                      >
                        {tCommon('web.buyButton', 'Commander')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceScreen;
