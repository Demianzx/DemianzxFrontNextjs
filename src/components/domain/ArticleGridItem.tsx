import React from 'react';
import { Link } from 'react-router-dom';
import ProgressiveImage from '../common/ProgressiveImage';

interface ArticleGridItemProps {
  id: string;
  slug?: string; 
  title: string;
  date: string;
  imageUrl: string;
}

const ArticleGridItem: React.FC<ArticleGridItemProps> = ({
  id,
  slug,
  title,
  date,
  imageUrl
}) => {
  const articleUrl = `/articles/${slug || id}`;
  
  return (
    <Link 
      to={articleUrl}
      className="block group overflow-hidden rounded-lg"
    >
      <div className="relative h-80 overflow-hidden">
        <ProgressiveImage
          src={imageUrl}
          alt={title}
          className="transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {title}
          </h2>
          <p className="text-gray-400">
            {date}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ArticleGridItem;