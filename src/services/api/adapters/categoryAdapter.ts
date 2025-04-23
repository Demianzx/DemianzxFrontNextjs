import { CategoryDto } from '../web-api-client';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export const adaptCategory = (dto: CategoryDto): Category => {
  return {
    id: dto.id || 0,
    name: dto.name || '',
    slug: dto.slug || '',
    description: dto.description
  };
};