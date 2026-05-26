import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUri: string;
  createdAt: string;
  updatedAt?: string;
}

interface GalleryState {
  items: GalleryItem[];
}

const initialState: GalleryState = { items: [] };

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    addGalleryItem: (state, action: PayloadAction<GalleryItem>) => {
      state.items.push(action.payload);
    },
    updateGalleryItem: (state, action: PayloadAction<GalleryItem>) => {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteGalleryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    setGalleryItems: (state, action: PayloadAction<GalleryItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  setGalleryItems,
} = gallerySlice.actions;
export const selectGalleryItems = (state: any) => state.gallery?.items || [];
export default gallerySlice.reducer;
