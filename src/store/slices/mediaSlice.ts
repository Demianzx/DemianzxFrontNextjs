import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mediaService, MediaFile } from '../../services/api';

interface MediaState {
  files: MediaFile[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number | null;
  currentUpload: {
    fileName: string | null;
    progress: number;
    isUploading: boolean;
  };
}

const initialState: MediaState = {
  files: [],
  isLoading: false,
  error: null,
  uploadProgress: null,
  currentUpload: {
    fileName: null,
    progress: 0,
    isUploading: false
  }
};

// Thunks
export const fetchMediaFiles = createAsyncThunk(
  'media/fetchMediaFiles',
  async (prefix?: string) => {
    return await mediaService.getMediaFiles(prefix);
  }
);

export const uploadMediaFile = createAsyncThunk(
  'media/uploadMediaFile',
  async (file: File, { dispatch }) => {
    dispatch(setCurrentUpload({ fileName: file.name, isUploading: true }));
    
    try {
      // En un entorno real, podríamos implementar una función para monitorear el progreso
      // Simulamos actualizaciones de progreso cada 250ms
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          dispatch(updateUploadProgress(progress));
        }
      }, 250);
      
      const response = await mediaService.uploadMediaFile(file);
      
      clearInterval(interval);
      dispatch(updateUploadProgress(100));
      
      // Simular un pequeño retraso para mostrar 100% antes de completar
      setTimeout(() => {
        dispatch(resetUploadProgress());
      }, 500);
      
      return response;
    } catch (error) {
      dispatch(resetUploadProgress());
      throw error;
    }
  }
);

export const deleteMediaFile = createAsyncThunk(
  'media/deleteMediaFile',
  async (blobName: string) => {
    await mediaService.deleteMediaFile(blobName);
    return blobName;
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setCurrentUpload: (state, action) => {
      state.currentUpload = {
        ...state.currentUpload,
        fileName: action.payload.fileName,
        isUploading: action.payload.isUploading,
        progress: 0
      };
    },
    updateUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
      state.currentUpload.progress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = null;
      state.currentUpload = {
        fileName: null,
        progress: 0,
        isUploading: false
      };
    }
  },
  extraReducers: (builder) => {
    // Manejar fetchMediaFiles
    builder
      .addCase(fetchMediaFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMediaFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload;
      })
      .addCase(fetchMediaFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch media files';
      })

    // Manejar uploadMediaFile
      .addCase(uploadMediaFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadMediaFile.fulfilled, (state, action) => {
        state.isLoading = false;
        // No actualizamos los archivos aquí, recargaremos la lista completa después de subir
      })
      .addCase(uploadMediaFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to upload media file';
      })

    // Manejar deleteMediaFile
      .addCase(deleteMediaFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMediaFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = state.files.filter(file => file.name !== action.payload);
      })
      .addCase(deleteMediaFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete media file';
      });
  }
});

export const { 
  setCurrentUpload, 
  updateUploadProgress, 
  resetUploadProgress 
} = mediaSlice.actions;

export default mediaSlice.reducer;