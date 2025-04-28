import { MediaFilesClient } from './web-api-client';
import apiClient from './apiClient';
import { adaptMediaFile, MediaFile } from './adapters/mediaAdapter';

const mediaFilesClient = new MediaFilesClient('', apiClient);

const uploadWithRetry = async (file: File, retries = 3): Promise<string> => {
  try {
    console.log(`Attempting to upload file: ${file.name} (type: ${file.type}, size: ${file.size})`);
    
    // Crear un FormData manualmente para asegurarnos de que se configura correctamente
    const formData = new FormData();
    formData.append("file", file, file.name);
    
    // Usar apiClient directamente con la configuración adecuada
    const response = await apiClient.post('/api/MediaFiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Eliminar Content-Type para que el navegador establezca el boundary correctamente
        'X-Content-Type-Override': 'multipart/form-data',
      },
    });
    
    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Upload error:", error.message);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    if (retries <= 0) {
      console.error("No more retries left, throwing error");
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Retrying upload, ${retries} attempts left`);
    return uploadWithRetry(file, retries - 1);
  }
};

export const mediaService = {
  async uploadMediaFile(file: File): Promise<string> {
    try {
      return await uploadWithRetry(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  },

  async getMediaFiles(prefix?: string): Promise<MediaFile[]> {
    try {
      const response = await mediaFilesClient.getMediaFiles(prefix || null);
      return response.map(adaptMediaFile);
    } catch (error) {
      console.error('Error fetching media files:', error);
      return []; 
    }
  },

  async deleteMediaFile(blobName: string): Promise<void> {
    try {
      await mediaFilesClient.deleteMediaFile(blobName);
    } catch (error) {
      console.error('Error deleting media file:', error);
      throw error;
    }
  }
};