"use client";

import React from 'react';
import { MediaFile } from '../../services/api/adapters/mediaAdapter';
import MediaItem from './MediaItem';

interface MediaGridProps {
  files: MediaFile[];
  isLoading: boolean;
  selectable?: boolean;
  selectedFiles?: string[];
  onSelect?: (fileUrl: string) => void;
  onDelete?: (blobName: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  files,
  isLoading,
  selectable = false,
  selectedFiles = [],
  onSelect = () => {},
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="bg-gray-800 rounded-md h-40 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="bg-gray-800 rounded-md p-8 text-center">
        <p className="text-gray-400">No media files found. Upload some!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map(file => (
        <MediaItem
          key={file.name}
          file={file}
          isSelected={selectedFiles.includes(file.name)}
          selectable={selectable}
          onSelect={() => onSelect(file.name)}
          onDelete={onDelete ? () => onDelete(file.name) : undefined}
        />
      ))}
    </div>
  );
};

export default MediaGrid;