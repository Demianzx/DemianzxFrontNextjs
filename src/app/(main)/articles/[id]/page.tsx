import ArticleDetailPage from '@/pages/Articles/ArticleDetailPage';
import { Suspense } from 'react';

export default function ArticleDetail({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleDetailPage id={params.id} />
    </Suspense>
  );
}