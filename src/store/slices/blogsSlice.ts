import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { blogPostService, BlogPost, BlogPostSimplified } from '../../services/api';

interface BlogsState {
  posts: {
    items: BlogPost[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    isLoading: boolean;
    error: string | null;
  };
  currentPost: {
    data: BlogPost | null;
    isLoading: boolean;
    error: string | null;
  };
  featuredPosts: {
    items: BlogPost[];
    isLoading: boolean;
    error: string | null;
  };
  popularPosts: {
    items: BlogPost[];
    isLoading: boolean;
    error: string | null;
  };
  relatedPosts: {
    items: BlogPostSimplified[];
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: BlogsState = {
  posts: {
    items: [],
    pageNumber: 1,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    isLoading: false,
    error: null
  },
  currentPost: {
    data: null,
    isLoading: false,
    error: null
  },
  featuredPosts: {
    items: [],
    isLoading: false,
    error: null
  },
  popularPosts: {
    items: [],
    isLoading: false,
    error: null
  },
  relatedPosts: {
    items: [],
    isLoading: false,
    error: null
  }
};

// Thunks
export const fetchBlogPosts = createAsyncThunk(
  'blogs/fetchBlogPosts',
  async ({ 
    page = 1, 
    pageSize = 10, 
    includeDrafts = false 
  }: { 
    page?: number; 
    pageSize?: number; 
    includeDrafts?: boolean 
  }) => {
    return await blogPostService.getBlogPosts(page, pageSize, includeDrafts);
  }
);

export const fetchBlogPostBySlug = createAsyncThunk(
  'blogs/fetchBlogPostBySlug',
  async (slug: string) => {
    return await blogPostService.getBlogPostBySlug(slug);
  }
);

export const fetchPublicBlogPostBySlug = createAsyncThunk(
  'blogs/fetchPublicBlogPostBySlug',
  async (slug: string) => {
    return await blogPostService.getPublicBlogPostBySlug(slug);
  }
);

export const fetchFeaturedBlogPosts = createAsyncThunk(
  'blogs/fetchFeaturedBlogPosts',
  async (count: number = 3) => {
    return await blogPostService.getFeaturedBlogPosts(count);
  }
);

export const fetchPopularBlogPosts = createAsyncThunk(
  'blogs/fetchPopularBlogPosts',
  async (count: number = 3) => {
    return await blogPostService.getPopularBlogPosts(count);
  }
);

export const fetchRelatedBlogPosts = createAsyncThunk(
  'blogs/fetchRelatedBlogPosts',
  async ({ id, postId, count = 3 }: { id: number; postId: number; count?: number }) => {
    return await blogPostService.getRelatedBlogPosts(id, postId, count);
  }
);

export const searchBlogPosts = createAsyncThunk(
  'blogs/searchBlogPosts',
  async ({
    searchText,
    page = 1,
    pageSize = 10,
    options
  }: {
    searchText: string;
    page?: number;
    pageSize?: number;
    options?: {
      fromDate?: Date;
      toDate?: Date;
      categorySlug?: string;
      tagSlug?: string;
      authorId?: string;
      sortBy?: string;
      sortDirection?: string;
    }
  }) => {
    return await blogPostService.searchBlogPosts(searchText, page, pageSize, options);
  }
);

export const createBlogPost = createAsyncThunk(
  'blogs/createBlogPost',
  async (post: {
    title: string;
    content: string;
    featuredImageUrl?: string;
    thumbnailImageUrl?: string;
    isPublished: boolean;
    isFeatured: boolean;
    categoryIds: number[];
    tagIds: number[];
  }) => {
    return await blogPostService.createBlogPost(post);
  }
);

export const updateBlogPost = createAsyncThunk(
  'blogs/updateBlogPost',
  async ({
    id,
    post
  }: {
    id: number;
    post: {
      title: string;
      content: string;
      featuredImageUrl?: string;
      thumbnailImageUrl?: string;
      isPublished: boolean;
      isFeatured: boolean;
      categoryIds: number[];
      tagIds: number[];
    }
  }) => {
    await blogPostService.updateBlogPost(id, post);
    return { id, ...post }; // Devolvemos los datos actualizados para actualizar el state
  }
);

export const deleteBlogPost = createAsyncThunk(
  'blogs/deleteBlogPost',
  async (id: number) => {
    await blogPostService.deleteBlogPost(id);
    return id; // Devolvemos el id para eliminarlo del state
  }
);

export const incrementPostViewCount = createAsyncThunk(
  'blogs/incrementPostViewCount',
  async (id: number) => {
    await blogPostService.incrementPostViewCount(id);
    return id;
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost.data = null;
      state.currentPost.error = null;
    }
  },
  extraReducers: (builder) => {
    // Manejar fetchBlogPosts
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.posts.isLoading = true;
        state.posts.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.posts.isLoading = false;
        state.posts.items = action.payload.items;
        state.posts.pageNumber = action.payload.pageNumber;
        state.posts.totalPages = action.payload.totalPages;
        state.posts.totalCount = action.payload.totalCount;
        state.posts.hasPreviousPage = action.payload.hasPreviousPage;
        state.posts.hasNextPage = action.payload.hasNextPage;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.posts.isLoading = false;
        state.posts.error = action.error.message || 'Failed to fetch blog posts';
      })

    // Manejar fetchBlogPostBySlug
      .addCase(fetchBlogPostBySlug.pending, (state) => {
        state.currentPost.isLoading = true;
        state.currentPost.error = null;
      })
      .addCase(fetchBlogPostBySlug.fulfilled, (state, action) => {
        state.currentPost.isLoading = false;
        state.currentPost.data = action.payload;
      })
      .addCase(fetchBlogPostBySlug.rejected, (state, action) => {
        state.currentPost.isLoading = false;
        state.currentPost.error = action.error.message || 'Failed to fetch blog post';
      })

    // Manejar fetchPublicBlogPostBySlug
      .addCase(fetchPublicBlogPostBySlug.pending, (state) => {
        state.currentPost.isLoading = true;
        state.currentPost.error = null;
      })
      .addCase(fetchPublicBlogPostBySlug.fulfilled, (state, action) => {
        state.currentPost.isLoading = false;
        state.currentPost.data = action.payload;
      })
      .addCase(fetchPublicBlogPostBySlug.rejected, (state, action) => {
        state.currentPost.isLoading = false;
        state.currentPost.error = action.error.message || 'Failed to fetch public blog post';
      })

    // Manejar fetchFeaturedBlogPosts
      .addCase(fetchFeaturedBlogPosts.pending, (state) => {
        state.featuredPosts.isLoading = true;
        state.featuredPosts.error = null;
      })
      .addCase(fetchFeaturedBlogPosts.fulfilled, (state, action) => {
        state.featuredPosts.isLoading = false;
        state.featuredPosts.items = action.payload;
      })
      .addCase(fetchFeaturedBlogPosts.rejected, (state, action) => {
        state.featuredPosts.isLoading = false;
        state.featuredPosts.error = action.error.message || 'Failed to fetch featured posts';
      })

    // Manejar fetchPopularBlogPosts
      .addCase(fetchPopularBlogPosts.pending, (state) => {
        state.popularPosts.isLoading = true;
        state.popularPosts.error = null;
      })
      .addCase(fetchPopularBlogPosts.fulfilled, (state, action) => {
        state.popularPosts.isLoading = false;
        state.popularPosts.items = action.payload;
      })
      .addCase(fetchPopularBlogPosts.rejected, (state, action) => {
        state.popularPosts.isLoading = false;
        state.popularPosts.error = action.error.message || 'Failed to fetch popular posts';
      })

    // Manejar fetchRelatedBlogPosts
      .addCase(fetchRelatedBlogPosts.pending, (state) => {
        state.relatedPosts.isLoading = true;
        state.relatedPosts.error = null;
      })
      .addCase(fetchRelatedBlogPosts.fulfilled, (state, action) => {
        state.relatedPosts.isLoading = false;
        state.relatedPosts.items = action.payload;
      })
      .addCase(fetchRelatedBlogPosts.rejected, (state, action) => {
        state.relatedPosts.isLoading = false;
        state.relatedPosts.error = action.error.message || 'Failed to fetch related posts';
      })

    // Manejar searchBlogPosts
      .addCase(searchBlogPosts.pending, (state) => {
        state.posts.isLoading = true;
        state.posts.error = null;
      })
      .addCase(searchBlogPosts.fulfilled, (state, action) => {
        state.posts.isLoading = false;
        state.posts.items = action.payload.items;
        state.posts.pageNumber = action.payload.pageNumber;
        state.posts.totalPages = action.payload.totalPages;
        state.posts.totalCount = action.payload.totalCount;
        state.posts.hasPreviousPage = action.payload.hasPreviousPage;
        state.posts.hasNextPage = action.payload.hasNextPage;
      })
      .addCase(searchBlogPosts.rejected, (state, action) => {
        state.posts.isLoading = false;
        state.posts.error = action.error.message || 'Failed to search blog posts';
      })

    // Manejar createBlogPost (no necesitamos actualizar el state, solo para errores)
      .addCase(createBlogPost.rejected, (state, action) => {
        // Solo manejamos el error, no actualizamos el state porque redirigiremos
      })

    // Manejar updateBlogPost
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        // Actualizar el post en la lista si existe
        const index = state.posts.items.findIndex(post => post.id === action.payload.id);
        if (index !== -1 && state.currentPost.data) {
          // Aquí solo actualizamos los campos básicos, el post completo se obtendría con otro fetch
          state.posts.items[index] = {
            ...state.posts.items[index],
            title: action.payload.title,
            content: action.payload.content,
            featuredImageUrl: action.payload.featuredImageUrl,
            thumbnailImageUrl: action.payload.thumbnailImageUrl,
            isPublished: action.payload.isPublished,
            isFeatured: action.payload.isFeatured
          };

          // También actualizamos el post actual si coincide el id
          if (state.currentPost.data.id === action.payload.id) {
            state.currentPost.data = {
              ...state.currentPost.data,
              title: action.payload.title,
              content: action.payload.content,
              featuredImageUrl: action.payload.featuredImageUrl,
              thumbnailImageUrl: action.payload.thumbnailImageUrl,
              isPublished: action.payload.isPublished,
              isFeatured: action.payload.isFeatured
            };
          }
        }
      })

    // Manejar deleteBlogPost
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        // Eliminar el post de la lista
        state.posts.items = state.posts.items.filter(post => post.id !== action.payload);
        
        // Si el post actual es el que eliminamos, limpiarlo
        if (state.currentPost.data && state.currentPost.data.id === action.payload) {
          state.currentPost.data = null;
        }
      });
  }
});

export const { clearCurrentPost } = blogsSlice.actions;

export default blogsSlice.reducer;