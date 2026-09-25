import { GamesClient, CreateGameCommand, UpdateGameCommand } from './web-api-client';
import apiClient from './apiClient';
import { adaptGameListItem, GameListItem } from './adapters/gameAdapter';

// Inicializar el cliente generado por NSwag
const gamesClient = new GamesClient('', apiClient);

export const gameService = {
  // Obtener juegos paginados (solo los de posts publicados por defecto)
  async getGames(page: number = 1, pageSize: number = 12, categorySlug?: string, includeDrafts: boolean = false): Promise<{
    items: GameListItem[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }> {
    const response = await gamesClient.getGames(page, pageSize, categorySlug, includeDrafts);
    return {
      items: response.items?.map(adaptGameListItem) || [],
      pageNumber: response.pageNumber || 1,
      totalPages: response.totalPages || 0,
      totalCount: response.totalCount || 0,
      hasPreviousPage: response.hasPreviousPage || false,
      hasNextPage: response.hasNextPage || false
    };
  },

  // Crear un juego asociado a un post
  async createGame(game: {
    blogPostId: number;
    embedUrl: string;
    aspectRatio?: string;
    allowFullScreen: boolean;
    instructions?: string;
  }): Promise<number> {
    const command = CreateGameCommand.fromJS(game);
    return await gamesClient.createGame(command);
  },

  // Actualizar un juego existente
  async updateGame(id: number, game: {
    embedUrl: string;
    aspectRatio?: string;
    allowFullScreen: boolean;
    instructions?: string;
  }): Promise<void> {
    const command = UpdateGameCommand.fromJS({
      id,
      ...game
    });
    await gamesClient.updateGame(id, command);
  },

  // Eliminar el juego de un post
  async deleteGame(id: number): Promise<void> {
    await gamesClient.deleteGame(id);
  }
};