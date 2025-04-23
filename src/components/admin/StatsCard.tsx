import React from 'react';

interface StatsCardProps {
  value: string | number;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-center">
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
};

export default StatsCard;