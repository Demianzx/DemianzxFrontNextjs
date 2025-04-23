import React from 'react';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import AdminDataTable from '../../components/admin/AdminDataTable';

const AdminUsersPage: React.FC = () => {
  // Datos de ejemplo (en una implementación real, estos vendrían de una API)
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', registerDate: 'January 10, 2024', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', registerDate: 'February 15, 2024', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Author', registerDate: 'March 20, 2024', status: 'Active' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Subscriber', registerDate: 'March 25, 2024', status: 'Inactive' },
    { id: '5', name: 'Mike Brown', email: 'mike@example.com', role: 'Subscriber', registerDate: 'April 1, 2024', status: 'Active' },
  ];

  // Definimos la interface para nuestro tipo de usuario
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    registerDate: string;
    status: string;
  }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Register Date', accessor: 'registerDate' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (item: User) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {item.status}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (item: User) => (
        <div className="flex space-x-2">
          <button className="text-blue-400 hover:text-blue-300">Edit</button>
          <button className="text-red-400 hover:text-red-300">Delete</button>
        </div>
      )
    }
  ];

  const handleNewUser = () => {
    // En una implementación real, esto abriría un formulario para crear un nuevo usuario
    console.log('Create new user');
  };

  return (
    <div>
      <AdminSectionHeader 
        title="Users" 
        buttonText="Add New User" 
        onButtonClick={handleNewUser} 
      />
      
      <AdminDataTable
        columns={columns}
        data={users}
      />
    </div>
  );
};

export default AdminUsersPage;