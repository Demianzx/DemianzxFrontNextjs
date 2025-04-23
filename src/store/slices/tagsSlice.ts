import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tagService, Tag } from '../../services/api';

interface TagsState {
  items: Tag[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  items: [],
  isLoading: false,
  error: null
};

// Thunks
export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async () => {
    return await tagService.getTags();
  }
);

export const createTag = createAsyncThunk(
  'tags/createTag',
  async (name: string) => {
    const id = await tagService.createTag(name);
    return { id, name };
  }
);

export const deleteTag = createAsyncThunk(
  'tags/deleteTag',
  async (id: number) => {
    await tagService.deleteTag(id);
    return id;
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Manejar fetchTags
    builder
      .addCase(fetchTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tags';
      })

    // Manejar createTag
      .addCase(createTag.fulfilled, (state, action) => {
        // Crear slug a partir del nombre (simplificado)
        const slug = action.payload.name
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
        
        state.items.push({
          id: action.payload.id,
          name: action.payload.name,
          slug
        });
      })

    // Manejar deleteTag
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.items = state.items.filter(tag => tag.id !== action.payload);
      });
  }
});

export default tagsSlice.reducer;