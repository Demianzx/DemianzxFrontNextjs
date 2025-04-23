import React from 'react';
import Button from '../common/Button';

interface AdminSectionHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({ 
  title, 
  buttonText, 
  onButtonClick 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {buttonText && (
        <Button onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default AdminSectionHeader;