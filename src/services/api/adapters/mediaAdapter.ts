import { BlobDto } from '../web-api-client';

export interface MediaFile {
  name: string;
  uri: string;
  contentType: string;
  size: number;
  created: Date;
}

export const adaptMediaFile = (dto: BlobDto): MediaFile => {
  return {
    name: dto.name || '',
    uri: dto.uri || '',
    contentType: dto.contentType || '',
    size: dto.size || 0,
    created: dto.created || new Date()
  };
};