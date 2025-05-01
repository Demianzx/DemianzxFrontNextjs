"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '../../components/common/Button';
import SimpleMarkdownEditor from '../../components/admin/SimpleMarkdownEditor';
import MultiSelect, { Option } from '../../components/admin/MultiSelect';
import MediaSelectionModal from '../../components/media/MediaSelectionModal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBlogPost, updateBlogPost, fetchBlogPostBySlug } from '../../store/slices/blogsSlice';
import { fetchCategories, createCategory } from '../../store/slices/categoriesSlice';
import { fetchTags, createTag } from '../../store/slices/tagsSlice';
import { addNotification } from '../../store/slices/uiSlice';

interface PostFormData {
  title: string;
  content: string;
  featuredImageUrl: string;
  thumbnailImageUrl: string;
  categories: Option[];
  tags: Option[];
  status: 'published' | 'draft';
}

interface AdminPostFormPageProps {
  slug?: string;
}

const AdminPostFormPage: React.FC<AdminPostFormPageProps> = ({ slug: propSlug }) => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const slug = propSlug || params?.slug as string;
  const isEditMode = !!slug;
  
  // Obtenemos los datos del estado global
  const categories = useAppSelector(state => state.categories.items);
  const tags = useAppSelector(state => state.tags.items);
  const currentPost = useAppSelector(state => state.blogs.currentPost.data);
  const isLoadingPost = useAppSelector(state => state.blogs.currentPost.isLoading);
  const isLoadingCategories = useAppSelector(state => state.categories.isLoading);
  const isLoadingTags = useAppSelector(state => state.tags.isLoading);
  
  // Estado local del formulario
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    featuredImageUrl: '',
    thumbnailImageUrl: '',
    categories: [],
    tags: [],
    status: 'draft'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para controlar los modales de selección de imágenes
  const [isFeaturedImageModalOpen, setIsFeaturedImageModalOpen] = useState(false);
  const [isThumbnailImageModalOpen, setIsThumbnailImageModalOpen] = useState(false);
  
  // Cargamos los datos necesarios al montar el componente
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    
    if (isEditMode) {
      dispatch(fetchBlogPostBySlug(slug));
    }
  }, [dispatch, slug, isEditMode]);
  
  // Actualizamos el formulario cuando se carga un post para editar
  useEffect(() => {
    if (isEditMode && currentPost) {
      setFormData({
        title: currentPost.title,
        content: currentPost.content,
        featuredImageUrl: currentPost.featuredImageUrl || '',
        thumbnailImageUrl: currentPost.thumbnailImageUrl || '',
        categories: currentPost.categories.map(cat => ({ id: cat.id, name: cat.name })),
        tags: currentPost.tags.map(tag => ({ id: tag.id, name: tag.name })),
        status: currentPost.isPublished ? 'published' : 'draft'
      });
    }
  }, [currentPost, isEditMode]);
  
  // Manejadores de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleContentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };
  
  const handleFeaturedImageChange = (url: string) => {
    console.log('Featured image selected:', url); // Add logging to debug
    setFormData(prev => ({
      ...prev,
      featuredImageUrl: url
    }));
    setIsFeaturedImageModalOpen(false); // Close modal after selection
  };
  
  const handleThumbnailImageChange = (url: string) => {
    console.log('Thumbnail image selected:', url); // Add logging to debug
    setFormData(prev => ({
      ...prev,
      thumbnailImageUrl: url
    }));
    setIsThumbnailImageModalOpen(false); // Close modal after selection
  };
  
  const handleCategoriesChange = (selectedCategories: Option[]) => {
    setFormData(prev => ({
      ...prev,
      categories: selectedCategories
    }));
  };
  
  const handleTagsChange = (selectedTags: Option[]) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedTags
    }));
  };
  
  // Funciones para crear nuevas categorías y tags
  const handleCreateCategory = async (name: string): Promise<Option> => {
    const resultAction = await dispatch(createCategory({ name }));
    if (createCategory.fulfilled.match(resultAction)) {
      dispatch(addNotification({
        type: 'success',
        message: `Category "${name}" created successfully`
      }));
      return { id: resultAction.payload.id, name };
    } else {
      throw new Error('Failed to create category');
    }
  };
  
  const handleCreateTag = async (name: string): Promise<Option> => {
    const resultAction = await dispatch(createTag(name));
    if (createTag.fulfilled.match(resultAction)) {
      dispatch(addNotification({
        type: 'success',
        message: `Tag "${name}" created successfully`
      }));
      return { id: resultAction.payload.id, name };
    } else {
      throw new Error('Failed to create tag');
    }
  };
  
  // Funciones para enviar el formulario
  const handleSubmit = async (e: React.FormEvent, publishStatus: 'draft' | 'published' = 'draft') => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter a title for the post'
      }));
      return;
    }
    
    if (!formData.content.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Post content cannot be empty'
      }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        featuredImageUrl: formData.featuredImageUrl || undefined,
        thumbnailImageUrl: formData.thumbnailImageUrl || undefined,
        isPublished: publishStatus === 'published',
        isFeatured: false, // Por defecto no es destacado
        categoryIds: formData.categories.map(cat => Number(cat.id)),
        tagIds: formData.tags.map(tag => Number(tag.id))
      };
      
      let resultAction;
      
      if (isEditMode && currentPost) {
        resultAction = await dispatch(updateBlogPost({
          id: Number(currentPost.id),
          post: postData
        }));
        
        if (updateBlogPost.fulfilled.match(resultAction)) {
          dispatch(addNotification({
            type: 'success',
            message: `Post updated successfully${publishStatus === 'published' ? ' and published' : ''}`
          }));
        }
      } else {
        resultAction = await dispatch(createBlogPost(postData));
        
        if (createBlogPost.fulfilled.match(resultAction)) {
          dispatch(addNotification({
            type: 'success',
            message: `Post created successfully${publishStatus === 'published' ? ' and published' : ''}`
          }));
        }
      }
      
      router.push('/admin/posts');
    } catch (error: unknown) {
      // Convertir el error a string de manera segura
      const errorMessage = error instanceof Error ? error.message : 'Error saving post';
      
      dispatch(addNotification({
        type: 'error',
        message: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Estos manejadores llaman a handleSubmit con un parámetro, pero
  // los pasamos como callbacks a botones, por lo que necesitamos adaptarlos
  const handleSaveAsDraft = () => {
    // Creamos un evento sintético básico para pasarlo a handleSubmit
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(syntheticEvent, 'draft');
  };
  
  const handlePublish = () => {
    // Creamos un evento sintético básico para pasarlo a handleSubmit
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(syntheticEvent, 'published');
  };
  
  const handleCancel = () => {
    router.push('/admin/posts');
  };
  
  if (isLoadingPost || isLoadingCategories || isLoadingTags) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Post' : 'Create Post'}</h1>
      
      <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-6">
        {/* Título */}
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
            placeholder="Enter post title"
            required
          />
        </div>
        
        {/* Imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg mb-2">Featured Image</label>
            <div className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
              {formData.featuredImageUrl ? (
                <div className="relative group">
                  <img 
                    src={formData.featuredImageUrl} 
                    alt="Featured" 
                    className="w-full h-[250px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setIsFeaturedImageModalOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeaturedImageChange('')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="h-[250px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => setIsFeaturedImageModalOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">Click to select featured image</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-lg mb-2">Thumbnail Image</label>
            <div className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
              {formData.thumbnailImageUrl ? (
                <div className="relative group">
                  <img 
                    src={formData.thumbnailImageUrl} 
                    alt="Thumbnail" 
                    className="w-full h-[250px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setIsThumbnailImageModalOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => handleThumbnailImageChange('')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="h-[250px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => setIsThumbnailImageModalOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">Click to select thumbnail image</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Categorías y Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MultiSelect
            options={categories.map(cat => ({ id: cat.id, name: cat.name }))}
            selectedOptions={formData.categories}
            onChange={handleCategoriesChange}
            label="Categories"
            placeholder="Select categories"
            allowCreate={true}
            onCreateOption={handleCreateCategory}
          />
          
          <MultiSelect
            options={tags.map(tag => ({ id: tag.id, name: tag.name }))}
            selectedOptions={formData.tags}
            onChange={handleTagsChange}
            label="Tags"
            placeholder="Select tags"
            allowCreate={true}
            onCreateOption={handleCreateTag}
          />
        </div>
        
        {/* Editor Markdown */}
        <div>
          <label htmlFor="content" className="block text-lg mb-2">
            Content
          </label>
          <SimpleMarkdownEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your post content here..."
            height={400}
          />
        </div>
        
        {/* Botones de acción */}
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveAsDraft}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </Button>
          
          <Button
            type="button"
            variant="primary"
            onClick={handlePublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </form>
      
      {/* Modales para selección de imágenes */}
      <MediaSelectionModal
        isOpen={isFeaturedImageModalOpen}
        onClose={() => setIsFeaturedImageModalOpen(false)}
        onSelect={handleFeaturedImageChange}
        title="Select Featured Image"
      />
      
      <MediaSelectionModal
        isOpen={isThumbnailImageModalOpen}
        onClose={() => setIsThumbnailImageModalOpen(false)}
        onSelect={handleThumbnailImageChange}
        title="Select Thumbnail Image"
      />
    </div>
  );
};

export default AdminPostFormPage;