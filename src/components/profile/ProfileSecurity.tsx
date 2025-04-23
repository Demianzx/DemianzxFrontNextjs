import React, { useState } from 'react';
import Button from '../common/Button';

const ProfileSecurity: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setError(null);
    setSuccess(null);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }
    
    // In a real implementation, we would call the API here
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess("Password changed successfully");
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        
        {error && (
          <div className="bg-red-900 text-red-200 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 text-green-200 p-3 rounded-md mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-gray-400 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-gray-400 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-400 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Two-Factor Authentication</h3>
        <p className="text-gray-400 mb-4">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
        
        <Button variant="outline">
          Enable Two-Factor Authentication
        </Button>
      </div>
    </div>
  );
};

export default ProfileSecurity;