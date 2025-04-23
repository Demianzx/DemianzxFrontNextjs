import React, { useState } from 'react';
import Button from '../../components/common/Button';

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Game Blog',
    siteDescription: 'Your source for the latest gaming news, reviews, and articles.',
    postsPerPage: '10',
    allowComments: true,
    requireApproval: true,
    emailNotifications: true,
    theme: 'dark'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En una implementación real, esto enviaría los datos a la API
    console.log('Save settings:', settings);
    // Mostrar mensaje de éxito
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          
          <div>
            <label htmlFor="siteName" className="block text-gray-400 mb-2">
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          <div>
            <label htmlFor="siteDescription" className="block text-gray-400 mb-2">
              Site Description
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          <div>
            <label htmlFor="postsPerPage" className="block text-gray-400 mb-2">
              Posts Per Page
            </label>
            <input
              type="number"
              id="postsPerPage"
              name="postsPerPage"
              value={settings.postsPerPage}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          <h2 className="text-xl font-semibold mb-4">Comment Settings</h2>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowComments"
              name="allowComments"
              checked={settings.allowComments}
              onChange={handleChange}
              className="h-5 w-5 rounded text-purple-600 focus:ring-purple-600 bg-gray-700 border-gray-600"
            />
            <label htmlFor="allowComments" className="ml-2 text-gray-300">
              Allow comments on posts
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireApproval"
              name="requireApproval"
              checked={settings.requireApproval}
              onChange={handleChange}
              className="h-5 w-5 rounded text-purple-600 focus:ring-purple-600 bg-gray-700 border-gray-600"
            />
            <label htmlFor="requireApproval" className="ml-2 text-gray-300">
              Require approval for comments
            </label>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              className="h-5 w-5 rounded text-purple-600 focus:ring-purple-600 bg-gray-700 border-gray-600"
            />
            <label htmlFor="emailNotifications" className="ml-2 text-gray-300">
              Enable email notifications
            </label>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div>
            <label htmlFor="theme" className="block text-gray-400 mb-2">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="px-8"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;