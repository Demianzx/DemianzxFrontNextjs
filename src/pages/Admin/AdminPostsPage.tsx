"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import AdminDataTable, { Column } from '../../components/admin/AdminDataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBlogPosts } from '../../store/slices/blogsSlice';
import Image from 'next/image';

// Definimos la interface para nuestro tipo de post para la tabla
interface PostTableItem extends Record<string, unknown> {
  id: string | number;
  slug?: string;
  title: string;
  status: string;
  date: string;
  author: string;
  thumbnailImageUrl?: string;
}

const AdminPostsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { items: posts, isLoading, error } = useAppSelector(state => state.blogs.posts);

  useEffect(() => {
    dispatch(fetchBlogPosts({ 
      page: 1, 
      pageSize: 20, 
      includeDrafts: true 
    }));
  }, [dispatch]);

  const columns: Column<PostTableItem>[] = [
    { 
      header: 'Thumbnail', 
      accessor: 'thumbnailImageUrl',
      render: (item: PostTableItem) => (
        <div className="w-16 h-16 overflow-hidden rounded">
          <Image 
            src={item.thumbnailImageUrl as string || 'https://picsum.photos/100/100?random=1'} 
            alt={item.title as string}
            className="w-full h-full object-cover"
            width={64}
            height={64}
            unoptimized
          />
        </div>
      )
    },
    { header: 'Title', accessor: 'title' },
    { header: 'Status', accessor: 'status',
      render: (item: PostTableItem) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'Published' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
        }`}>
          {item.status}
        </span>
      )
    },
    { header: 'Date', accessor: 'date' },
    { header: 'Author', accessor: 'author' },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (item: PostTableItem) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-400 hover:text-blue-300"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Item slug de la lista: ', item.slug);
              if (item.slug) {
                handleEditPost(item.slug);
              } else {
                // Opcional: Manejar el caso donde no hay slug (mostrar error, usar ID si es posible, etc.)
                console.error("Error: No se encontró slug para el post con ID:", item.id);
                alert("No se puede editar este post porque no tiene slug.");
              }
            }}
          >
            Edit
          </button>
          <button 
            className="text-red-400 hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation();
              if (item.slug) {
                handleDeletePost(item.slug);
              }
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ];
  const tableData: PostTableItem[] = posts.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    status: post.isPublished ? 'Published' : 'Draft',
    date: post.publishedDate 
      ? new Date(post.publishedDate).toLocaleDateString() 
      : 'Not published',
    author: post.authorName || 'Unknown',
    thumbnailImageUrl: post.thumbnailImageUrl
  }));
  const handleNewPost = () => {
    router.push('/admin/posts/create');
  };

  const handleEditPost = (slug: string | number) => {
    router.push(`/admin/posts/edit/${slug}`);
  };

  const handleDeletePost = (slug: string | number) => {
    console.log('Delete post:', slug);
    alert(`Post with slig ${slug} would be deleted`);
  };

  const handleRowClick = (post: PostTableItem) => {
    router.push(`/admin/posts/edit/${post.slug}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 text-white p-4 rounded-md">
        Error loading posts: {error}
      </div>
    );
  }

  return (
    <div>
      <AdminSectionHeader 
        title="Posts" 
        buttonText="Add New Post" 
        onButtonClick={handleNewPost} 
      />
      
      <AdminDataTable<PostTableItem>
        columns={columns}
        data={tableData}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default AdminPostsPage;