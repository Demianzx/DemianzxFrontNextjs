import { BlogPostDto, BlogPostSimplifiedDto } from '../web-api-client';

// Tipos que usaremos en la aplicación
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  featuredImageUrl?: string;
  thumbnailImageUrl?: string;
  publishedDate?: Date;
  isPublished: boolean;
  isFeatured: boolean;
  authorId: string;
  authorName: string;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
}

export interface BlogPostSimplified {
  id: number;
  title: string;
  slug: string;
  featuredImageUrl?: string;
  thumbnailImageUrl?: string;
  excerpt: string;
}

// Adaptadores para transformar los DTOs a nuestros tipos
export const adaptBlogPost = (dto: BlogPostDto): BlogPost => {
  return {
    id: dto.id || 0,
    title: dto.title || '',
    slug: dto.slug || '',
    content: dto.content || '',
    featuredImageUrl: dto.featuredImageUrl,
    thumbnailImageUrl: dto.thumbnailImageUrl,
    publishedDate: dto.publishedDate,
    isPublished: dto.isPublished || false,
    isFeatured: dto.isFeatured || false,
    authorId: dto.authorId || '',
    authorName: dto.authorName || '',
    categories: dto.categories?.map(c => ({
      id: c.id || 0,
      name: c.name || '',
      slug: c.slug || ''
    })) || [],
    tags: dto.tags?.map(t => ({
      id: t.id || 0,
      name: t.name || '',
      slug: t.slug || ''
    })) || []
  };
};

export const adaptBlogPostSimplified = (dto: BlogPostSimplifiedDto): BlogPostSimplified => {
  return {
    id: dto.id || 0,
    title: dto.title || '',
    slug: dto.slug || '',
    featuredImageUrl: dto.featuredImageUrl,
    thumbnailImageUrl: dto.thumbnailImageUrl,
    excerpt: dto.excerpt || ''
  };
};