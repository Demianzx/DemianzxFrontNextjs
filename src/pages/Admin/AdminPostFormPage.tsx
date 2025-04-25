"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '../../components/common/Button';
import MdxEditor from '../../components/admin/MdxEditor';
import ImageUploader from '../../components/admin/ImageUploader';
import MultiSelect, { Option } from '../../components/admin/MultiSelect';
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
  id?: string;
}

const AdminPostFormPage: React.FC<AdminPostFormPageProps> = ({ id: propId }) => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const id = propId || params?.id as string;
  const isEditMode = !!id;
  
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
  
  // Cargamos los datos necesarios al montar el componente
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    
    if (isEditMode) {
      dispatch(fetchBlogPostBySlug(id));
    }
  }, [dispatch, id, isEditMode]);
  
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
    setFormData(prev => ({
      ...prev,
      featuredImageUrl: url
    }));
  };
  
  const handleThumbnailImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      thumbnailImageUrl: url
    }));
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
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error.message || 'Error saving post'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveAsDraft = (e: React.FormEvent) => {
    handleSubmit(e, 'draft');
  };
  
  const handlePublish = (e: React.FormEvent) => {
    handleSubmit(e, 'published');
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
      
      <form onSubmit={handleSaveAsDraft} className="space-y-6">
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
          <ImageUploader 
            imageUrl={formData.featuredImageUrl} 
            onImageChange={handleFeaturedImageChange}
            label="Featured Image"
            height={250}
          />
          
          <ImageUploader 
            imageUrl={formData.thumbnailImageUrl} 
            onImageChange={handleThumbnailImageChange}
            label="Thumbnail Image"
            height={250}
          />
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
          <MdxEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your post content here..."
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
            type="submit"
            variant="secondary"
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
    </div>
  );
};