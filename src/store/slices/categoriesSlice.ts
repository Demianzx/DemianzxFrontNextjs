import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { categoryService, Category } from '../../services/api';

interface CategoriesState {
  items: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  isLoading: false,
  error: null
};

// Thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    return await categoryService.getCategories();
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (category: { name: string; description?: string }) => {
    const id = await categoryService.createCategory(category);
    return { id, ...category };
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, category }: { id: number; category: { name: string; description?: string } }) => {
    await categoryService.updateCategory(id, category);
    return { id, ...category };
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number) => {
    await categoryService.deleteCategory(id);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Manejar fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })

    // Manejar createCategory
      .addCase(createCategory.fulfilled, (state, action) => {
        // Crear slug a partir del nombre (simplificado)
        const slug = action.payload.name
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
        
        state.items.push({
          id: action.payload.id,
          name: action.payload.name,
          description: action.payload.description,
          slug
        });
      })

    // Manejar updateCategory
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          // Creamos un nuevo slug si el nombre cambió
          const slug = action.payload.name
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-');
          
          state.items[index] = {
            ...state.items[index],
            name: action.payload.name,
            description: action.payload.description,
            slug
          };
        }
      })

    // Manejar deleteCategory
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(cat => cat.id !== action.payload);
      });
  }
});

export default categoriesSlice.reducer;