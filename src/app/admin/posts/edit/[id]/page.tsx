import AdminPostFormPage from '@/pages/Admin/AdminPostFormPage';

export default function EditPost({ params }: { params: { id: string } }) {
  return <AdminPostFormPage id={params.id} />;
}