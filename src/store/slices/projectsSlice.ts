import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Project, PaymentStatus } from '../../database/schema';
import type { RootState } from '../index';

// ──────────────────────────────────────────────
// Thunks (async — Firebase)
// ──────────────────────────────────────────────
export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  const { projectsService } = await import('../../services/projectsService');
  return projectsService.getAll();
});

export const createProject = createAsyncThunk(
  'projects/create',
  async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { projectsService } = await import('../../services/projectsService');
    return projectsService.create(data);
  },
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }: { id: string; data: Partial<Project> }) => {
    const { projectsService } = await import('../../services/projectsService');
    return projectsService.update(id, data);
  },
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string) => {
    const { projectsService } = await import('../../services/projectsService');
    await projectsService.remove(id);
    return id;
  },
);

export const toggleProjectActive = createAsyncThunk(
  'projects/toggleActive',
  async ({ id, isActive }: { id: string; isActive: boolean }) => {
    const { projectsService } = await import('../../services/projectsService');
    return projectsService.update(id, { isActive, updatedAt: new Date().toISOString() });
  },
);

export const updatePaymentStatus = createAsyncThunk(
  'projects/updatePayment',
  async ({
    id,
    paymentStatus,
    expirationDate,
  }: {
    id: string;
    paymentStatus: PaymentStatus;
    expirationDate?: string;
  }) => {
    const { projectsService } = await import('../../services/projectsService');
    return projectsService.update(id, {
      paymentStatus,
      expirationDate,
      updatedAt: new Date().toISOString(),
    });
  },
);

// ──────────────────────────────────────────────
// State
// ──────────────────────────────────────────────
interface ProjectsState {
  items: Project[];
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: [],
  selectedProjectId: null,
  loading: false,
  error: null,
};

// ──────────────────────────────────────────────
// Slice
// ──────────────────────────────────────────────
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject(state, action: PayloadAction<string | null>) {
      state.selectedProjectId = action.payload;
    },
    upsertProject(state, action: PayloadAction<Project>) {
      const idx = state.items.findIndex(p => p.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    removeProject(state, action: PayloadAction<string>) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // fetchAll
    builder
      .addCase(fetchProjects.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch projects';
      });

    // create
    builder
      .addCase(createProject.pending, state => { state.loading = true; state.error = null; })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to create project';
      });

    // update / toggleActive / updatePayment
    const handleUpdate = (state: ProjectsState, action: PayloadAction<Project>) => {
      state.loading = false;
      const idx = state.items.findIndex(p => p.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    };
    builder
      .addCase(updateProject.pending, state => { state.loading = true; state.error = null; })
      .addCase(updateProject.fulfilled, handleUpdate)
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to update project';
      })
      .addCase(toggleProjectActive.fulfilled, handleUpdate)
      .addCase(updatePaymentStatus.fulfilled, handleUpdate);

    // delete
    builder
      .addCase(deleteProject.pending, state => { state.loading = true; state.error = null; })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to delete project';
      });
  },
});

export const {
  setSelectedProject,
  upsertProject,
  removeProject,
  clearError,
} = projectsSlice.actions;

// ──────────────────────────────────────────────
// Selectors
// ──────────────────────────────────────────────
export const selectAllProjects = (state: RootState) => state.projects.items;
export const selectProjectById = (id: string) => (state: RootState) =>
  state.projects.items.find(p => p.id === id);
export const selectSelectedProjectId = (state: RootState) =>
  state.projects.selectedProjectId;
export const selectSelectedProject = (state: RootState) => {
  const id = state.projects.selectedProjectId;
  return id ? state.projects.items.find(p => p.id === id) ?? null : null;
};
export const selectProjectsLoading = (state: RootState) => state.projects.loading;
export const selectProjectsError = (state: RootState) => state.projects.error;
export const selectActiveProjects = (state: RootState) =>
  state.projects.items.filter(p => p.isActive);

export default projectsSlice.reducer;
