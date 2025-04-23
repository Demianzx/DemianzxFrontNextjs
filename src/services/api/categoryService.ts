import { CategoriesClient, CreateCategoryCommand, UpdateCategoryCommand } from './web-api-client';
import apiClient from './apiClient';
import { adaptCategory, Category } from './adapters/categoryAdapter';

const categoriesClient = new CategoriesClient('', apiClient);

export const categoryService = {
  // Obtener todas las categorías
  async getCategories(): Promise<Category[]> {
    const response = await categoriesClient.getCategories();
    return response.map(adaptCategory);
  },

  // Crear una nueva categoría
  async createCategory(category: { name: string; description?: string }): Promise<number> {
    const command = CreateCategoryCommand.fromJS(category);
    return await categoriesClient.createCategory(command);
  },

  // Actualizar una categoría existente
  async updateCategory(id: number, category: { name: string; description?: string }): Promise<void> {
    const command = UpdateCategoryCommand.fromJS({
      id,
      ...category
    });
    await categoriesClient.updateCategory(id, command);
  },

  // Eliminar una categoría
  async deleteCategory(id: number): Promise<void> {
    await categoriesClient.deleteCategory(id);
  }
};