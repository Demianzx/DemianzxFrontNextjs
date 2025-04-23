import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeaturedArticle from '../../components/domain/FeaturedArticle';
import ArticleCard from '../../components/domain/ArticleCard';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchFeaturedBlogPosts, fetchBlogPosts, fetchPopularBlogPosts } from '../../store/slices/blogsSlice';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Seleccionamos los estados relevantes del store
  const featuredPosts = useAppSelector(state => state.blogs.featuredPosts.items);
  const latestPosts = useAppSelector(state => state.blogs.posts.items);
  const popularPosts = useAppSelector(state => state.blogs.popularPosts.items);
  
  const isLoadingFeatured = useAppSelector(state => state.blogs.featuredPosts.isLoading);
  const isLoadingLatest = useAppSelector(state => state.blogs.posts.isLoading);
  const isLoadingPopular = useAppSelector(state => state.blogs.popularPosts.isLoading);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(fetchFeaturedBlogPosts(1)); // Obtener 1 post destacado
    dispatch(fetchBlogPosts({ page: 1, pageSize: 4 })); // Obtener últimos posts
    dispatch(fetchPopularBlogPosts(4)); // Obtener posts populares
  }, [dispatch]);

  // Si no hay posts destacados, mostrar el primero de los posts normales
  const featuredArticle = featuredPosts.length > 0 
    ? featuredPosts[0] 
    : latestPosts.length > 0 ? latestPosts[0] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Article */}
      <section className="mb-12">
        {isLoadingFeatured ? (
          <div className="w-full h-[500px] bg-gray-800 animate-pulse rounded-lg"></div>
        ) : featuredArticle ? (
          <FeaturedArticle 
            id={String(featuredArticle.id)}
            slug={featuredArticle.slug}
            title={featuredArticle.title}
            excerpt={featuredArticle.content.substring(0, 120) + '...'}
            date={featuredArticle.publishedDate ? new Date(featuredArticle.publishedDate).toLocaleDateString() : 'Unknown date'}
            imageUrl={featuredArticle.featuredImageUrl || 'https://picsum.photos/1200/600'}
          />
        ) : (
          <div className="w-full h-[500px] bg-gray-800 flex items-center justify-center rounded-lg">
            <p className="text-gray-400">No featured articles available</p>
          </div>
        )}
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Articles */}
        <div className="lg:col-span-2">
          <section>
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            {isLoadingLatest ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : latestPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.slice(featuredPosts.length > 0 ? 0 : 1, 3).map(post => (
                  <ArticleCard 
                    key={post.id}
                    id={String(post.id)}
                    slug={post.slug}
                    title={post.title}
                    date={post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'Unknown date'}
                    category={post.categories.length > 0 ? post.categories[0].name : 'Uncategorized'}
                    imageUrl={post.thumbnailImageUrl || 'https://picsum.photos/400/300'}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No articles available</p>
            )}
          </section>
        </div>
        
        {/* Popular Articles (reemplazando Popular Reviews) */}
        <div>
          <section>
            <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
            {isLoadingPopular ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-16"></div>
                ))}
              </div>
            ) : popularPosts.length > 0 ? (
              <div className="space-y-4">
                {popularPosts.map(post => (
                  <Link 
                      key={post.id} 
                      to={`/articles/${post.slug || post.id}`}
                      className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                    <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                      <img
                        src={post.thumbnailImageUrl || 'https://picsum.photos/100/100'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold">{post.title}</h3>
                      <p className="text-sm text-gray-400">
                        {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No popular articles available</p>
            )}
          </section>
        </div>
      </div>
      
      {/* Coming Soon Banner */}
      <section className="mt-12">
        <div className="w-full h-64 bg-gray-800 rounded-lg overflow-hidden relative">
          <img 
            src="https://picsum.photos/1200/400" 
            alt="Featured game" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Coming Soon: More Gaming Content</h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;