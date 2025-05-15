import AdminPostFormPage from '@/blogPages/Admin/AdminPostFormPage';
import { use } from 'react';

export default function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  
  return <AdminPostFormPage slug={resolvedParams.slug} />;
}