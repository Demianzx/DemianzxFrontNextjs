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
  async (file: File, { dispatch, rejectWithValue }) => {
    dispatch(setCurrentUpload({ fileName: file.name, isUploading: true }));
    
    try {
      // Simulamos actualizaciones de progreso
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          dispatch(updateUploadProgress(progress));
        }
      }, 250);
      
      // Intentar subir el archivo
      const response = await mediaService.uploadMediaFile(file);
      
      // Limpiar intervalo y mostrar 100%
      clearInterval(interval);
      dispatch(updateUploadProgress(100));
      
      // Pequeño retraso antes de completar
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(resetUploadProgress());
      
      return response;
    } catch (error: any) {
      // Asegurarnos de limpiar estado de carga en caso de error
      dispatch(resetUploadProgress());
      
      // Devolver mensaje de error apropiado
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to upload file');
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