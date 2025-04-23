import React, { useState } from 'react';
import Button from '../common/Button';

interface ProfileInfoProps {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user.name || '');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setIsLoading(true);
    
    // Simulación de una llamada a la API
    setTimeout(() => {
      setIsLoading(false);
      setEditMode(false);
      // Aquí actualizaríamos el estado del usuario en Redux
    }, 1000);
  };
  
  if (editMode) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Edit Personal Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white"
            />
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <label htmlFor="displayName" className="block text-gray-400 mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-gray-400 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => setEditMode(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <Button onClick={() => setEditMode(true)}>
          Edit Profile
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Email</h3>
          <p className="text-gray-400">{user.email}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Display Name</h3>
          <p className="text-gray-400">{user.name || 'Not set'}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Role</h3>
          <p className="text-gray-400">{user.role || 'User'}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Bio</h3>
          <p className="text-gray-400">{bio || 'No bio available'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;