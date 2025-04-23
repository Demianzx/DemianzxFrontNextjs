import React from 'react';

interface RecentItemProps {
  title: string;
  date: string;
}

const RecentItem: React.FC<RecentItemProps> = ({ title, date }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
      <div className="font-medium">{title}</div>
      <div className="text-gray-400 text-sm">{date}</div>
    </div>
  );
};

export default RecentItem;