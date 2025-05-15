import ArticleDetailPage from '@/blogPages/Articles/ArticleDetailPage';
import { Suspense } from 'react';
import { use } from 'react';

export default function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleDetailPage id={resolvedParams.id} />
    </Suspense>
  );
}