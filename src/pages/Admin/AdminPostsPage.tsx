// src/pages/Admin/AdminPostsPage.tsx (modificado)
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBlogPosts } from '../../store/slices/blogsSlice';
import Image from 'next/image';

const AdminPostsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Obtener los posts del store
  const { items: posts, isLoading, error } = useAppSelector(state => state.blogs.posts);

  // Cargar los posts al montar el componente
  useEffect(() => {
    dispatch(fetchBlogPosts({ 
      page: 1, 
      pageSize: 20, 
      includeDrafts: true // Incluir borradores
    }));
  }, [dispatch]);

  // Definimos la interface para nuestro tipo de post
  interface Post {
    id: string | number;
    title: string;
    status: string;
    date: string;
    author: string;
    thumbnailImageUrl?: string;
  }

  const columns = [
    { 
      header: 'Thumbnail', 
      accessor: 'thumbnailImageUrl',
      render: (item: Post) => (
        <div className="w-16 h-16 overflow-hidden rounded">
          <Image 
            src={item.thumbnailImageUrl || 'https://picsum.photos/100/100?random=1'} 
            alt={item.title}
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
      render: (item: Post) => (
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
      render: (item: Post) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-400 hover:text-blue-300"
            onClick={(e) => {
              e.stopPropagation();
              handleEditPost(item.id);
            }}
          >
            Edit
          </button>
          <button 
            className="text-red-400 hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePost(item.id);
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  // Transformar los posts de la API al formato que espera la tabla
  const tableData = posts.map(post => ({
    id: post.id,
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

  const handleEditPost = (id: string | number) => {
    router.push(`/admin/posts/edit/${id}`);
  };

  const handleDeletePost = (id: string | number) => {
    // En una implementación real, esto mostraría un diálogo de confirmación
    // y luego eliminaría el post a través de una API
    console.log('Delete post:', id);
    alert(`Post with ID ${id} would be deleted`);
  };

  const handleRowClick = (post: Post) => {
    router.push(`/admin/posts/edit/${post.id}`);
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
      
      <AdminDataTable
        columns={columns}
        data={tableData}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default AdminPostsPage;