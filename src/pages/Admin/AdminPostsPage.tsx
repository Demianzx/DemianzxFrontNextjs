import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import AdminDataTable from '../../components/admin/AdminDataTable';

const AdminPostsPage: React.FC = () => {
  const navigate = useNavigate();

  // Definimos la interface para nuestro tipo de post
  interface Post {
    id: string;
    title: string;
    status: string;
    date: string;
    author: string;
  }

  // Datos de ejemplo (en una implementación real, estos vendrían de una API)
  const posts = [
    { id: '1', title: 'The Future of Virtual Reality Gaming', status: 'Published', date: 'April 24, 2024', author: 'John Doe' },
    { id: '2', title: 'Top 10 FPS Games of 2024', status: 'Published', date: 'April 20, 2024', author: 'Jane Smith' },
    { id: '3', title: 'Exploring the World of Indie Games', status: 'Draft', date: 'April 18, 2024', author: 'John Doe' },
    { id: '4', title: 'The Evolution of Racing Games', status: 'Published', date: 'April 15, 2024', author: 'Mike Johnson' },
    { id: '5', title: 'Mobile Gaming: The New Frontier', status: 'Draft', date: 'April 10, 2024', author: 'Sarah Wilson' },
  ];

  const columns = [
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

  const handleNewPost = () => {
    navigate('/admin/posts/create');
  };

  const handleEditPost = (id: string) => {
    navigate(`/admin/posts/edit/${id}`);
  };

  const handleDeletePost = (id: string) => {
    // En una implementación real, esto mostraría un diálogo de confirmación
    // y luego eliminaría el post a través de una API
    console.log('Delete post:', id);
    alert(`Post with ID ${id} would be deleted`);
  };

  const handleRowClick = (post: Post) => {
    navigate(`/admin/posts/edit/${post.id}`);
  };

  return (
    <div>
      <AdminSectionHeader 
        title="Posts" 
        buttonText="Add New Post" 
        onButtonClick={handleNewPost} 
      />
      
      <AdminDataTable
        columns={columns}
        data={posts}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default AdminPostsPage;