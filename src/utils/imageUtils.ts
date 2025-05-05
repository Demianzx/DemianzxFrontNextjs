/**
 * Verifica y formatea una URL de imagen para que sea válida para next/image
 * @param imageUrl URL de la imagen a validar
 * @returns URL válida para next/image
 */
export const getValidImageUrl = (imageUrl: string): string => {
    // Si ya es una URL completa (http o https), devolverla tal cual
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Si es una ruta relativa sin barra inicial, agregar /
    if (!imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
      // Verificar si es un nombre de archivo de Azure Blob Storage
      if (imageUrl.includes('-') && (
          imageUrl.endsWith('.jpg') || 
          imageUrl.endsWith('.jpeg') || 
          imageUrl.endsWith('.png') || 
          imageUrl.endsWith('.gif') || 
          imageUrl.endsWith('.webp')
        )) {
        // Agregar el dominio completo de Azure Blob Storage
        return `https://demianzxgamesstorage.blob.core.windows.net/media/${imageUrl}`;
      }
      
      // Si parece ser un GUID o nombre de archivo sin extensión reconocible
      if (imageUrl.match(/^[a-f0-9-]+$/i)) {
        return `https://demianzxgamesstorage.blob.core.windows.net/media/${imageUrl}`;
      }
      
      // URL de placeholder para imágenes inválidas
      return 'https://picsum.photos/800/600?random=1';
    }
    
    // Si es una ruta relativa con barra inicial, convertirla a absoluta
    if (imageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_BASE_URL || ''}${imageUrl}`;
    }
    
    // Para URLs de datos (data:image/...)
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // Si no coincide con ningún formato conocido, devolver una imagen de placeholder
    return 'https://picsum.photos/800/600?random=1';
  };