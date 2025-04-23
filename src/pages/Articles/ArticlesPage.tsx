import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBlogPosts } from '../../store/slices/blogsSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import CategoryFilter from '../../components/domain/CategoryFilter';
import ArticleGridItem from '../../components/domain/ArticleGridItem';

const ArticlesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Seleccionamos los estados relevantes del store
  const articlesData = useAppSelector(state => state.blogs.posts);
  const categories = useAppSelector(state => state.categories.items);
  const isLoadingArticles = articlesData.isLoading;
  const isLoadingCategories = useAppSelector(state => state.categories.isLoading);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(fetchBlogPosts({ page: 1, pageSize: 10 }));
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Filtrar artículos por categoría seleccionada
  useEffect(() => {
    if (activeCategory !== 'All') {
      // Idealmente, utilizaríamos un endpoint específico para filtrar por categoría
      // Por ahora, simplemente refrescamos todos los posts y filtramos en el cliente
      dispatch(fetchBlogPosts({ page: 1, pageSize: 20 }));
    } else {
      dispatch(fetchBlogPosts({ page: 1, pageSize: 10 }));
    }
  }, [activeCategory, dispatch]);

  // Crear un array con "All" y los nombres de las categorías
  const categoryOptions = ['All', ...categories.map(category => category.name)];
  
  // Filtrar artículos por categoría activa (filtrado en el cliente)
  const displayedArticles = activeCategory === 'All' 
    ? articlesData.items 
    : articlesData.items.filter(article => 
        article.categories.some(category => category.name === activeCategory)
      );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-8">Articles</h1>
        
        {isLoadingCategories ? (
          <div className="h-10 bg-gray-800 animate-pulse rounded-md w-96"></div>
        ) : (
          <CategoryFilter 
            categories={categoryOptions}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        )}
      </div>
      
      {isLoadingArticles ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-gray-800 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : displayedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {displayedArticles.map(article => (
            <ArticleGridItem
              key={article.id}
              id={String(article.id)}
              slug={article.slug}
              title={article.title}
              date={article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'Unknown date'}
              imageUrl={article.featuredImageUrl || article.thumbnailImageUrl || 'https://picsum.photos/600/400'}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-10">No articles found in this category.</p>
      )}
    </div>
  );
};

export default ArticlesPage;