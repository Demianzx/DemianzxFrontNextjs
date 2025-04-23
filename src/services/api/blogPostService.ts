import { BlogPostsClient, CreateBlogPostCommand, UpdateBlogPostCommand } from './web-api-client';
import apiClient from './apiClient';
import { adaptBlogPost, adaptBlogPostSimplified, BlogPost, BlogPostSimplified } from './adapters/blogPostAdapter';

// Inicializar el cliente generado por NSwag
const blogPostsClient = new BlogPostsClient('', apiClient);

export const blogPostService = {
  // Obtener posts paginados
  async getBlogPosts(page: number = 1, pageSize: number = 10, includeDrafts: boolean = false): Promise<{
    items: BlogPost[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }> {
    const response = await blogPostsClient.getBlogPosts(page, pageSize, includeDrafts);
    return {
      items: response.items?.map(adaptBlogPost) || [],
      pageNumber: response.pageNumber || 1,
      totalPages: response.totalPages || 0,
      totalCount: response.totalCount || 0,
      hasPreviousPage: response.hasPreviousPage || false,
      hasNextPage: response.hasNextPage || false
    };
  },

  // Obtener posts simplificados (para listados)
  async getBlogPostsSimplified(
    page: number = 1, 
    pageSize: number = 10,
    categorySlug?: string,
    tagSlug?: string
  ): Promise<{
    items: BlogPostSimplified[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }> {
    const response = await blogPostsClient.getBlogPostsSimplified(page, pageSize, categorySlug, tagSlug);
    return {
      items: response.items?.map(adaptBlogPostSimplified) || [],
      pageNumber: response.pageNumber || 1,
      totalPages: response.totalPages || 0,
      totalCount: response.totalCount || 0,
      hasPreviousPage: response.hasPreviousPage || false,
      hasNextPage: response.hasNextPage || false
    };
  },

  // Obtener un post por su slug
  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    const response = await blogPostsClient.getBlogPostBySlug(slug);
    return adaptBlogPost(response);
  },

  // Obtener un post público por su slug
  async getPublicBlogPostBySlug(slug: string): Promise<BlogPost> {
    const response = await blogPostsClient.getPublicBlogPostBySlug(slug);
    return adaptBlogPost(response);
  },

  // Obtener posts destacados
  async getFeaturedBlogPosts(count: number = 3): Promise<BlogPost[]> {
    const response = await blogPostsClient.getFeaturedBlogPosts(count);
    return response.map(adaptBlogPost);
  },

  // Obtener posts populares
  async getPopularBlogPosts(count: number = 3): Promise<BlogPost[]> {
    const response = await blogPostsClient.getPopularBlogPosts(count);
    return response.map(adaptBlogPost);
  },

  // Incrementar el contador de vistas de un post
  async incrementPostViewCount(id: number): Promise<void> {
    await blogPostsClient.incrementPostViewCount(id);
  },

  // Buscar posts
  async searchBlogPosts(
    searchText: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    options?: {
      fromDate?: Date;
      toDate?: Date;
      categorySlug?: string;
      tagSlug?: string;
      authorId?: string;
      sortBy?: string;
      sortDirection?: string;
    }
  ): Promise<{
    items: BlogPost[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }> {
    const response = await blogPostsClient.searchBlogPosts(
      searchText,
      options?.fromDate,
      options?.toDate,
      options?.categorySlug,
      options?.tagSlug,
      options?.authorId,
      pageNumber,
      pageSize,
      options?.sortBy,
      options?.sortDirection
    );
    
    return {
      items: response.items?.map(adaptBlogPost) || [],
      pageNumber: response.pageNumber || 1,
      totalPages: response.totalPages || 0,
      totalCount: response.totalCount || 0,
      hasPreviousPage: response.hasPreviousPage || false,
      hasNextPage: response.hasNextPage || false
    };
  },

  // Obtener posts relacionados
  async getRelatedBlogPosts(id: number, postId: number, count: number = 3): Promise<BlogPostSimplified[]> {
    const response = await blogPostsClient.getRelatedBlogPosts(id, postId, count);
    return response.map(adaptBlogPostSimplified);
  },

  // Crear un nuevo post
  async createBlogPost(post: {
    title: string;
    content: string;
    featuredImageUrl?: string;
    thumbnailImageUrl?: string;
    isPublished: boolean;
    isFeatured: boolean;
    categoryIds: number[];
    tagIds: number[];
  }): Promise<number> {
    const command = CreateBlogPostCommand.fromJS(post);
    return await blogPostsClient.createBlogPost(command);
  },

  // Actualizar un post existente
  async updateBlogPost(id: number, post: {
    title: string;
    content: string;
    featuredImageUrl?: string;
    thumbnailImageUrl?: string;
    isPublished: boolean;
    isFeatured: boolean;
    categoryIds: number[];
    tagIds: number[];
  }): Promise<void> {
    const command = UpdateBlogPostCommand.fromJS({
      id,
      ...post
    });
    await blogPostsClient.updateBlogPost(id, command);
  },

  // Eliminar un post
  async deleteBlogPost(id: number): Promise<void> {
    await blogPostsClient.deleteBlogPost(id);
  }
};