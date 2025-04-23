import { TagsClient, CreateTagCommand } from './web-api-client';
import apiClient from './apiClient';
import { adaptTag, Tag } from './adapters/tagAdapter';

const tagsClient = new TagsClient('', apiClient);

export const tagService = {
  // Obtener todos los tags
  async getTags(): Promise<Tag[]> {
    const response = await tagsClient.getTags();
    return response.map(adaptTag);
  },

  // Crear un nuevo tag
  async createTag(name: string): Promise<number> {
    const command = CreateTagCommand.fromJS({ name });
    return await tagsClient.createTag(command);
  },

  // Eliminar un tag
  async deleteTag(id: number): Promise<void> {
    await tagsClient.deleteTag(id);
  }
};