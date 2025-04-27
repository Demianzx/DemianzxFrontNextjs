"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import AdminBreadcrumb from '../admin/AdminBreadcrumb';
import Image from 'next/image';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  useEffect(() => {
    setMounted(true);
    
    if (!isAuthenticated || (user?.role !== 'Administrator' && user?.role !== 'Admin')) {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);
  
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  // Si no está autenticado o no es admin, no renderizamos nada
  if (!isAuthenticated || (user?.role !== 'Administrator' && user?.role !== 'Admin')) {
    return null;
  }
  
  const isActiveRoute = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 md:px-10 bg-black border-b border-gray-800">
        <div className="flex items-center">
          {/* Mobile sidebar toggle */}
          <button 
            className="mr-4 text-gray-400 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">DEMIANZX</span>
            <span className="text-purple-500"> GAMES</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="hidden sm:block hover:text-purple-400 transition-colors">
            Admin
          </Link>
          <Link href="/admin" className="hidden sm:block hover:text-purple-400 transition-colors">
            Dashboard
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <Image 
                src="https://picsum.photos/100/100?random=10" 
                alt="Admin Avatar" 
                width={40}
                height={40}
                className="w-8 h-8 rounded-full"
                unoptimized
              />
              <span className="hidden sm:inline">{user?.name || user?.email || 'Admin'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="hidden sm:block h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Sidebar */}
        <aside 
          className={`
            md:w-60 bg-gray-900 md:min-h-screen p-4 
            fixed md:relative inset-y-0 left-0 transform 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 transition duration-200 ease-in-out
            z-30 w-64 overflow-y-auto h-full
          `}
        >
          <div className="flex justify-between items-center md:hidden mb-5">
            <h2 className="text-xl font-bold">Admin Menu</h2>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admin" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin') && pathname === '/admin'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/posts" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/posts')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/categories" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/categories')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/users" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/users')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Users
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/media" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/media')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Media
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/settings" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/settings')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Mobile only logout option */}
          <div className="mt-8 pt-4 border-t border-gray-800 md:hidden">
            <button 
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md w-full text-left"
            >
              Log out
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-grow p-6 md:ml-0 w-full">
          <AdminBreadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;