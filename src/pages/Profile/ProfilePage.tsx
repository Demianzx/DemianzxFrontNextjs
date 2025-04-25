"use client";

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useRouter } from 'next/navigation';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ProfileSecurity from '../../components/profile/ProfileSecurity';
import ProfileActivity from '../../components/profile/ProfileActivity';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'activity'>('info');
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || !user) {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);
  
  if (!mounted) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null; // No mostrar nada mientras se redirige
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar con pestañas */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-col items-center mb-6">
              <Image 
                src="https://picsum.photos/200/200?random=10" 
                alt="User Avatar" 
                className="w-24 h-24 rounded-full mb-4"
                width={96}
                height={96}
                unoptimized
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