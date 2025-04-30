"use client";

import React, { useState } from 'react';
import MediaGallery from './MediaGallery';

interface MediaSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  initialUrl?: string;
}

const MediaSelectionModal: React.FC<MediaSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media',
  initialUrl = ''
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(initialUrl);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  if (!isOpen) return null;

  const handleFileSelected = (fileUrl: string, fileName: string) => {
    setSelectedUrl(fileUrl);
    setSelectedFileName(fileName);
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-800 p-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {selectedUrl && (
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-16 h-16 overflow-hidden rounded mr-4">
                <img 
                  src={selectedUrl} 
                  alt="Selected media" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-1">Selected:</div>
                <div className="font-medium">{selectedFileName || 'Image'}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <MediaGallery 
            selectable
            selectedFiles={selectedFileName ? [selectedFileName] : []}
            onFileSelected={handleFileSelected}
          />
        </div>
        
        <div className="border-t border-gray-800 p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedUrl}
            className={`px-4 py-2 bg-purple-600 text-white rounded-md transition-colors ${
              selectedUrl ? 'hover:bg-purple-700' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaSelectionModal;