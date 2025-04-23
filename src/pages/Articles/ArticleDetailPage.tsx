import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPublicBlogPostBySlug, fetchBlogPostBySlug, fetchRelatedBlogPosts, incrementPostViewCount, clearCurrentPost } from '../../store/slices/blogsSlice';
import ArticleMetaBar from '../../components/domain/ArticleMetaBar';
import RelatedArticles from '../../components/domain/RelatedArticles';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  // Seleccionamos los estados relevantes del store
  const article = useAppSelector(state => state.blogs.currentPost.data);
  const isLoading = useAppSelector(state => state.blogs.currentPost.isLoading);
  const error = useAppSelector(state => state.blogs.currentPost.error);
  const relatedArticles = useAppSelector(state => state.blogs.relatedPosts.items);
  
  useEffect(() => {
    if (id) {
      // Limpiar el post actual antes de cargar uno nuevo
      dispatch(clearCurrentPost());
      
      // Intentar cargar el artículo por slug o id
      const isNumeric = !isNaN(Number(id));
      
      if (isNumeric) {
        // Si es un ID numérico
        dispatch(incrementPostViewCount(Number(id)));
        // Aquí necesitaríamos un método para obtener por ID
        // Por ahora, intentaremos obtenerlo como si fuera un slug
        dispatch(fetchBlogPostBySlug(id));
      } else {
        // Si es un slug, cargamos el artículo por slug
        dispatch(fetchPublicBlogPostBySlug(id));
      }
    }
    
    return () => {
      // Limpiar el post al desmontar el componente
      dispatch(clearCurrentPost());
    };
  }, [id, dispatch]);
  
  // Cargar artículos relacionados cuando tengamos el artículo principal
  useEffect(() => {
    if (article && article.id) {
      // El segundo parámetro sería el ID del post, que en este caso es el mismo que el ID de categoría
      dispatch(fetchRelatedBlogPosts({ 
        id: article.categories[0]?.id || 0, 
        postId: article.id, 
        count: 3 
      }));
    }
  }, [article, dispatch]);
  
  if (isLoading) {
    return (
      <div className="bg-black min-h-screen pb-12">
        <div className="h-[500px] bg-gray-900 animate-pulse w-full"></div>
        <div className="container mx-auto px-4 md:px-8 relative -mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="h-12 bg-gray-800 animate-pulse rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-800 animate-pulse rounded mb-10 w-1/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-800 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-800 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-800 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <p className="text-gray-400">{error || "We couldn't find the article you're looking for."}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-black min-h-screen pb-12">
      {/* Hero image con mejor contraste */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <img 
          src={article.featuredImageUrl || 'https://picsum.photos/1200/600?random=1'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient más pronunciado para asegurar contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>
      
      {/* Article content */}
      <div className="container mx-auto px-4 md:px-8 relative -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content - 3/4 width on large screens */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight drop-shadow-lg">
              {article.title}
            </h1>
            
            <div className="text-gray-400 mb-10 flex items-center">
              <span>{article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'Unknown date'}</span>
              <span className="mx-2">•</span>
              <span>{`${Math.ceil(article.content.length / 1000)} min read`}</span>
            </div>
            
            <ArticleMetaBar 
              authorName={article.authorName || 'Unknown Author'}
              authorAvatar={'https://picsum.photos/100/100?random=10'} // Debería venir del usuario
            />
            
            <div className="prose prose-lg prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            
            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-2">
              {article.categories.map(category => (
                <span key={category.id} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {category.name}
                </span>
              ))}
              {article.tags.map(tag => (
                <span key={tag.id} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          
          {/* Sidebar - 1/4 width on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-6 text-white">Related Articles</h2>
              {relatedArticles.length > 0 ? (
                <div className="space-y-6">
                  {relatedArticles.map(article => (
                    <div key={article.id} className="group">
                      <a href={`/articles/${article.slug || article.id}`} className="block">
                        <div className="mb-2 overflow-hidden rounded">
                          <img 
                            src={article.thumbnailImageUrl || 'https://picsum.photos/400/300?random=1'} 
                            alt={article.title}
                            className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-medium group-hover:text-purple-400 transition-colors">{article.title}</h3>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No related articles found.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Popular Articles */}
        <RelatedArticles 
          articles={relatedArticles.map(article => ({
            id: String(article.id),
            title: article.title,
            imageUrl: article.thumbnailImageUrl || 'https://picsum.photos/400/300?random=1',
            date: new Date().toLocaleDateString() // Fecha de ejemplo, debería venir del API
          }))} 
          currentArticleId={String(article.id)}
        />
      </div>
    </div>
  );
};

export default ArticleDetailPage;