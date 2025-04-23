import React from 'react';
import { Link } from 'react-router-dom';

interface ReviewCardProps {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  title,
  date,
  imageUrl
}) => {
  return (
    <Link to={`/reviews/${id}`} className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg transition-colors">
      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-gray-400">{date}</p>
      </div>
    </Link>
  );
};

export default ReviewCard;