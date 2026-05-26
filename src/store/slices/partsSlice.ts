import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  condition: 'comme neuf' | 'bon état' | 'pour pièces';
  category: string;
  description: string;
  image: string; // SVG identifier
  isFeatured?: boolean;
  isAvailable?: boolean;
}

interface PartsState {
  listings: Product[];
  favorites: string[];
  cart: string[];
}

const seedProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Mélangeur Cuisine...',
    subtitle: 'ROBINETTERIE',
    price: 145,
    condition: 'comme neuf',
    category: 'Robinetterie',
    description: 'Marque Grohe, peu utilisé, complet avec flexibles.',
    image: 'faucet',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'prod-2',
    title: 'Chauffe-eau Gaz 10L',
    subtitle: 'CHAUFFE-EAU',
    price: 320,
    condition: 'bon état',
    category: 'Chauffe-eau',
    description: 'Junkers en parfait état de marche, révisé récemment.',
    image: 'boiler',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'prod-3',
    title: 'Lot de raccords Cuivre',
    subtitle: 'CANALISATION',
    price: 45,
    condition: 'pour pièces',
    category: 'Canalisation',
    description: 'Divers diamètres, chutes utilisables pour petits travaux.',
    image: 'copper_fittings',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'prod-4',
    title: 'Mitigeur évier Grohe',
    subtitle: 'ROBINETTERIE',
    price: 180,
    condition: 'comme neuf',
    category: 'Robinetterie',
    description:
      "Mitigeur évier de cuisine Grohe chromé, comme neuf, complet dans sa boîte d'origine.",
    image: 'faucet',
    isFeatured: false,
    isAvailable: true,
  },
  {
    id: 'prod-5',
    title: 'Chauffe-eau électrique 50L',
    subtitle: 'CHAUFFE-EAU',
    price: 210,
    condition: 'bon état',
    category: 'Chauffe-eau',
    description:
      'Chauffe-eau électrique Ariston en bon état, fonctionne parfaitement, détartré récemment.',
    image: 'boiler',
    isFeatured: false,
    isAvailable: true,
  },
  {
    id: 'prod-6',
    title: 'Vannes et Raccords Laiton',
    subtitle: 'CANALISATION',
    price: 35,
    condition: 'pour pièces',
    category: 'Canalisation',
    description:
      "Lot de vannes d'arrêt et raccords en laiton d'occasion pour dépannage ou pièces.",
    image: 'copper_fittings',
    isFeatured: false,
    isAvailable: true,
  },
  {
    id: 'prod-7',
    title: 'Pompe de circulation Chauffage',
    subtitle: 'CANALISATION',
    price: 90,
    condition: 'bon état',
    category: 'Canalisation',
    description:
      'Circulateur de chauffage central de marque Grundfos, testé et fonctionnel.',
    image: 'copper_fittings',
    isFeatured: false,
    isAvailable: true,
  },
];

const initialState: PartsState = {
  listings: seedProducts,
  favorites: ['prod-1'],
  cart: ['prod-3'],
};

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setListings: (state, action: PayloadAction<Product[]>) => {
      state.listings = action.payload;
    },
    addListing: (state, action: PayloadAction<Product>) => {
      state.listings.push(action.payload);
    },
    updateListing: (state, action: PayloadAction<Product>) => {
      const index = state.listings.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.listings[index] = action.payload;
      }
    },
    deleteListing: (state, action: PayloadAction<string>) => {
      state.listings = state.listings.filter(p => p.id !== action.payload);
      state.favorites = state.favorites.filter(id => id !== action.payload);
      state.cart = state.cart.filter(id => id !== action.payload);
    },
    toggleFavoriteAction: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(favId => favId !== id);
      } else {
        state.favorites.push(id);
      }
    },
    addToCart: (state, action: PayloadAction<string>) => {
      if (!state.cart.includes(action.payload)) {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(cartId => cartId !== action.payload);
    },
    clearCart: state => {
      state.cart = [];
    },
  },
});

export const {
  setListings,
  addListing,
  updateListing,
  deleteListing,
  toggleFavoriteAction,
  addToCart,
  removeFromCart,
  clearCart,
} = partsSlice.actions;

export default partsSlice.reducer;
