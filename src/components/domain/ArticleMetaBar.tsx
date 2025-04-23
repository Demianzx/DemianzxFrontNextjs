import React from 'react';

interface ArticleMetaBarProps {
  authorName: string;
  authorAvatar: string;
}

const ArticleMetaBar: React.FC<ArticleMetaBarProps> = ({ 
  authorName, 
  authorAvatar 
}) => {
  return (
    <div className="flex justify-between items-center border-t border-b border-gray-800 py-4 my-8">
      <div className="flex items-center space-x-3">
        <img 
          src={authorAvatar}
          alt={authorName}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-sm text-gray-400">Written by</p>
          <p className="font-medium">{authorName}</p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ArticleMetaBar;