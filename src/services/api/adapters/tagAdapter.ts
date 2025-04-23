import { TagDto } from '../web-api-client';

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export const adaptTag = (dto: TagDto): Tag => {
  return {
    id: dto.id || 0,
    name: dto.name || '',
    slug: dto.slug || ''
  };
};