import { MediaFilesClient, FileParameter } from './web-api-client';
import apiClient from './apiClient';
import { adaptMediaFile, MediaFile } from './adapters/mediaAdapter';

const mediaFilesClient = new MediaFilesClient('', apiClient);

export const mediaService = {
  // Subir un archivo de medios
  async uploadMediaFile(file: File): Promise<string> {
    const fileParameter: FileParameter = { 
      data: file, 
      fileName: file.name 
    };
    return await mediaFilesClient.uploadMediaFile(fileParameter);
  },

  // Obtener archivos de medios
  async getMediaFiles(prefix?: string): Promise<MediaFile[]> {
    const response = await mediaFilesClient.getMediaFiles(prefix || null);
    return response.map(adaptMediaFile);
  },

  // Eliminar un archivo de medios
  async deleteMediaFile(blobName: string): Promise<void> {
    await mediaFilesClient.deleteMediaFile(blobName);
  }
};