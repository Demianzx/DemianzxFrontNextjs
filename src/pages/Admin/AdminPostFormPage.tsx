"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '../../components/common/Button';
import RichTextEditor from '../../components/admin/RichTextEditor';

interface PostFormData {
  title: string;
  category: string;
  content: string;
  status: 'published' | 'draft';
}

// Datos de categorías (en una implementación real vendrían de una API)
const categories = [
  { id: '1', name: 'PC Games' },
  { id: '2', name: 'Console Games' },
  { id: '3', name: 'Mobile Games' },
  { id: '4', name: 'VR Games' },
  { id: '5', name: 'Indie Games' },
  { id: '6', name: 'Game Reviews' },
  { id: '7', name: 'Gaming News' },
  { id: '8', name: 'Tutorials' },
];

interface AdminPostFormPageProps {
  id?: string;
}

const AdminPostFormPage: React.FC<AdminPostFormPageProps> = ({ id: propId }) => {
  const params = useParams();
  const router = useRouter();
  const id = propId || params?.id as string;
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    category: '',
    content: '',
    status: 'draft'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      // En una implementación real, aquí cargaríamos los datos del post desde una API
      setIsLoading(true);
      
      // Simulación de carga de datos
      setTimeout(() => {
        setFormData({
          title: 'Post de ejemplo',
          category: '1',
          content: 'Este es el contenido del post de ejemplo...',
          status: 'draft'
        });
        setIsLoading(false);
      }, 500);
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // En una implementación real, aquí enviaríamos los datos a una API
    console.log('Datos del formulario:', formData);
    
    // Simulación de envío exitoso
    setTimeout(() => {
      router.push('/admin/posts');
    }, 500);
  };

  const handleCancel = () => {
    router.push('/admin/posts');
  };

  const handlePublish = () => {
    setFormData(prev => ({
      ...prev,
      status: 'published'
    }));
    
    // Luego enviamos el formulario
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Post' : 'Create Post'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-lg mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
            required
          >
            <option value="" disabled>Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-lg mb-2">
            Content
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            placeholder="Write your content here..."
          />
        </div>
        
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="secondary"
          >
            Save as Draft
          </Button>
          
          <Button
            type="button"
            variant="primary"
            onClick={handlePublish}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminPostFormPage;