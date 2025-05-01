import AdminPostFormPage from '@/pages/Admin/AdminPostFormPage';

export default function EditPost({ params }: { params: { slug: string } }) {
  return <AdminPostFormPage slug={params.slug} />;
}