import React from 'react';

// En una implementación real, esta interfaz vendría del backend
interface ActivityItem {
  id: string;
  type: 'login' | 'post_view' | 'comment' | 'profile_update';
  timestamp: string;
  details: string;
}

const ProfileActivity: React.FC = () => {
  // Datos simulados de actividad
  const activityItems: ActivityItem[] = [
    {
      id: '1',
      type: 'login',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      details: 'Logged in from Chrome on Windows'
    },
    {
      id: '2',
      type: 'post_view',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      details: 'Viewed article: "The Future of Gaming"'
    },
    {
      id: '3',
      type: 'comment',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      details: 'Commented on: "Top 10 Games of 2025"'
    },
    {
      id: '4',
      type: 'profile_update',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      details: 'Updated profile information'
    }
  ];
  
  // Función para formatear la fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Iconos para los diferentes tipos de actividad
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'login':
        return (
          <div className="bg-blue-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm5 10V7l5 3-5 3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'post_view':
        return (
          <div className="bg-green-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="bg-yellow-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'profile_update':
        return (
          <div className="bg-purple-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-700 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
      
      {activityItems.length > 0 ? (
        <div className="space-y-4">
          {activityItems.map(item => (
            <div key={item.id} className="flex items-start space-x-4 bg-gray-700 rounded-lg p-4">
              {getActivityIcon(item.type)}
              
              <div className="flex-grow">
                <p className="text-white">{item.details}</p>
                <p className="text-sm text-gray-400">{formatDate(item.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No recent activity found.</p>
      )}
      
      <div className="mt-6 text-center">
        <button className="text-purple-400 hover:text-purple-300">
          Load More
        </button>
      </div>
    </div>
  );
};

export default ProfileActivity;