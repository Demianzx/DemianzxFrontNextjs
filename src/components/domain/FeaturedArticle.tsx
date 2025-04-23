import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

interface FeaturedArticleProps {
  id: string;
  slug?: string; 
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  id,
  slug,
  title,
  excerpt,
  date,
  imageUrl
}) => {
  const articleUrl = `/articles/${slug || id}`;
  
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
          {title}
        </h1>
        <p className="text-gray-300 mb-6 max-w-2xl">
          {date} {excerpt}
        </p>
        <Link to={articleUrl}>
          <Button variant="primary" size="lg">Read More</Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedArticle;