import { GameSimplifiedDto, GameSummaryDto } from '../web-api-client';

// Tipos que usaremos en la aplicación
export interface GameSummary {
  id: number;
  blogPostId: number;
  embedUrl: string;
  aspectRatio?: string;
  allowFullScreen: boolean;
  instructions?: string;
}

export interface GameListItem {
  id: number;
  embedUrl: string;
  aspectRatio?: string;
  allowFullScreen: boolean;
  instructions?: string;
  postId: number;
  // El título del post es el nombre del juego y el excerpt su descripción
  title: string;
  slug: string;
  thumbnailImageUrl?: string;
  publishedDate?: Date;
  authorId: string;
  authorName: string;
  categories: { id: number; name: string; slug: string }[];
}

// Adaptadores para transformar los DTOs a nuestros tipos
export const adaptGameSummary = (dto?: GameSummaryDto | null): GameSummary | undefined => {
  if (!dto) return undefined;
  return {
    id: dto.id || 0,
    blogPostId: dto.blogPostId || 0,
    embedUrl: dto.embedUrl || '',
    aspectRatio: dto.aspectRatio || '16:9',
    allowFullScreen: dto.allowFullScreen !== false,
    instructions: dto.instructions || undefined
  };
};

export const adaptGameListItem = (dto: GameSimplifiedDto): GameListItem => {
  return {
    id: dto.id || 0,
    embedUrl: dto.embedUrl || '',
    aspectRatio: dto.aspectRatio || '16:9',
    allowFullScreen: dto.allowFullScreen !== false,
    instructions: dto.instructions || undefined,
    postId: dto.postId || 0,
    title: dto.postTitle || '',
    slug: dto.postSlug || '',
    thumbnailImageUrl: dto.postThumbnailImageUrl || undefined,
    publishedDate: dto.postPublishedDate,
    authorId: dto.authorId || '',
    authorName: dto.authorName || '',
    categories: dto.categories?.map(c => ({
      id: c.id || 0,
      name: c.name || '',
      slug: c.slug || ''
    })) || []
  };
};