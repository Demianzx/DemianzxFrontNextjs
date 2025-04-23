import React from 'react';
import StatsCard from '../../components/admin/StatsCard';
import RecentItem from '../../components/admin/RecentItem';

const AdminDashboardPage: React.FC = () => {
  // Datos de ejemplo (en una implementación real, estos datos vendrían de una API)
  const stats = [
    { value: 120, label: 'Total Posts' },
    { value: 8, label: 'Total Categories' },
    { value: 1540, label: 'Total Users' },
    { value: 3567, label: 'Total Comments' }
  ];

  const recentPosts = [
    { id: '1', title: 'Vivamus Vel Ullamcorper', date: 'April 4' },
    { id: '2', title: 'Pellentesque Eget Erat', date: 'April 2' },
    { id: '3', title: 'Sed Dignissim Tellus', date: 'March 26' },
    { id: '4', title: 'Suspendisse Amet Mauris', date: 'March 18' },
    { id: '5', title: 'Aenean Lorem Ipsum', date: 'March 14' }
  ];

  const recentComments = [
    { id: '1', title: 'John Doe', date: 'April 4' },
    { id: '2', title: 'John Doe', date: 'April 2' },
    { id: '3', title: 'John Doe', date: 'March 26' },
    { id: '4', title: 'John Doe', date: 'March 19' },
    { id: '5', title: 'John Doe', date: 'April 4' }
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <StatsCard key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
      
      {/* Recent Posts and Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map(post => (
              <RecentItem 
                key={post.id} 
                title={post.title} 
                date={post.date} 
              />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Comments</h2>
          <div className="space-y-4">
            {recentComments.map(comment => (
              <RecentItem 
                key={comment.id} 
                title={comment.title} 
                date={comment.date} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;