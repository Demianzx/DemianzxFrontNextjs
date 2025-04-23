import React from 'react';
import { Link } from 'react-router-dom';

interface RelatedArticle {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  currentArticleId: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, currentArticleId }) => {
  // Filtrar para asegurarnos que no se muestre el artículo actual
  const filteredArticles = articles.filter(article => article.id !== currentArticleId);

  if (filteredArticles.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-800 pt-12">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.slice(0, 3).map(article => (
          <Link 
            key={article.id}
            to={`/articles/${article.id}`}
            className="group"
          >
            <div className="overflow-hidden rounded-lg mb-3">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="font-bold group-hover:text-purple-400 transition-colors">{article.title}</h3>
            <p className="text-sm text-gray-400">{article.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;