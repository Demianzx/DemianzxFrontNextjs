import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gameService, GameListItem } from '../../services/api';

interface GamesState {
  items: GameListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastCreatedGameId: number | null;
}

const initialState: GamesState = {
  items: [],
  pageNumber: 1,
  totalPages: 1,
  totalCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  currentPage: 1,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastCreatedGameId: null
};

// Thunks
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async ({ page = 1, pageSize = 12, categorySlug }: { page?: number; pageSize?: number; categorySlug?: string }) => {
    return await gameService.getGames(page, pageSize, categorySlug);
  }
);

export const createGame = createAsyncThunk(
  'games/createGame',
  async (game: {
    blogPostId: number;
    embedUrl: string;
    aspectRatio?: string;
    allowFullScreen: boolean;
    instructions?: string;
  }) => {
    const id = await gameService.createGame(game);
    return { id, ...game };
  }
);

export const updateGame = createAsyncThunk(
  'games/updateGame',
  async ({ id, game }: { id: number; game: { embedUrl: string; aspectRatio?: string; allowFullScreen: boolean; instructions?: string } }) => {
    await gameService.updateGame(id, game);
    return { id, ...game };
  }
);

export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (id: number) => {
    await gameService.deleteGame(id);
    return id;
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Manejar fetchGames
      .addCase(fetchGames.pending, (state, action) => {
        const isRefresh = state.items.length > 0 && (action.meta.arg?.page ?? 1) === 1;
        state.isLoading = !isRefresh;
        state.isRefreshing = isRefresh;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.items = action.payload.items;
        state.pageNumber = action.payload.pageNumber;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPreviousPage = action.payload.hasPreviousPage;
        state.currentPage = action.payload.pageNumber;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = action.error.message || 'Failed to fetch games';
      })

      // Manejar createGame
      .addCase(createGame.fulfilled, (state, action) => {
        state.lastCreatedGameId = action.payload.id;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create game';
      })

      // Manejar updateGame
      .addCase(updateGame.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update game';
      })

      // Manejar deleteGame
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.items = state.items.filter(game => game.id !== action.payload);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete game';
      });
  }
});

export default gamesSlice.reducer;