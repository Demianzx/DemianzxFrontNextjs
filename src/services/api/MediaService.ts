import { MediaFilesClient, FileParameter } from './web-api-client';
import apiClient from './apiClient';
import { adaptMediaFile, MediaFile } from './adapters/mediaAdapter';

const mediaFilesClient = new MediaFilesClient('', apiClient);

const uploadWithRetry = async (file: File, retries = 3): Promise<string> => {
  const fileParameter: FileParameter = { 
    data: file, 
    fileName: file.name 
  };
  
  try {
    return await mediaFilesClient.uploadMediaFile(fileParameter);
  } catch (error) {
    if (retries <= 0) throw error;
    
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
      // Devolver una URL simulada en caso de error durante desarrollo
      // En producción, deberías manejar esto de manera diferente
      return `https://example.com/mock-image/${file.name}`;
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

  // Eliminar un archivo de medios
  async deleteMediaFile(blobName: string): Promise<void> {
    try {
      await mediaFilesClient.deleteMediaFile(blobName);
    } catch (error) {
      console.error('Error deleting media file:', error);
      throw error; // Relanzar el error para manejarlo en el componente
    }
  }
};