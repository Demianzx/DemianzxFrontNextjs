import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

interface ArticleCardProps {
  id: string;
  slug?: string; 
  title: string;
  date: string;
  category: string;
  imageUrl: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  slug,
  title,
  date,
  category,
  imageUrl
}) => {
  const articleUrl = `/articles/${slug || id}`;
  
  return (
    <Card className="h-full">
      <Link to={articleUrl}>
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{date}</span>
            <span>{category}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ArticleCard;