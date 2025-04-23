import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Navigate } from 'react-router-dom';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ProfileSecurity from '../../components/profile/ProfileSecurity';
import ProfileActivity from '../../components/profile/ProfileActivity';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'activity'>('info');
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  // Si el usuario no está autenticado, redirigir al inicio
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar con pestañas */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-col items-center mb-6">
              <img 
                src="https://picsum.photos/200/200?random=10" 
                alt="User Avatar" 
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            
            <nav>
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeTab === 'info' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTab('info')}
                  >
                    Personal Information
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeTab === 'security' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTab('security')}
                  >
                    Security
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeTab === 'activity' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTab('activity')}
                  >
                    Activity
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="md:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6">
            {activeTab === 'info' && (
              <ProfileInfo user={user} />
            )}
            
            {activeTab === 'security' && (
              <ProfileSecurity />
            )}
            
            {activeTab === 'activity' && (
              <ProfileActivity />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;