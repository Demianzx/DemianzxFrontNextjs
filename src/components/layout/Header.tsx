import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import AuthModal from '../auth/AuthModal';

const Header: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Obtener el estado de autenticación y usuario de Redux
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const user = useAppSelector(state => state.auth.user);
  const isAdmin = user?.role === 'Admin';
  
  const handleLogout = () => {
    dispatch(logout());
    // Cerrar el menú móvil si está abierto
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    // Cerrar el menú de usuario
    setUserMenuOpen(false);
  };

  // Cerrar el menú de usuario cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);
  
  return (
    <header className="relative flex justify-between items-center py-5 px-6 md:px-10 bg-black text-white">
      <div className="text-2xl font-bold">
        <Link to="/" className="flex items-center">
          <span className="text-white">DEMIANZX</span>
          <span className="text-purple-500"> GAMES</span>
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-gray-300 hover:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Menu"
      >
        {!mobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
      
      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-6">
        <nav className={`${searchExpanded ? 'hidden md:block' : 'block'}`}>
          <ul className="flex space-x-8">
            <li><Link to="/" className={`hover:text-purple-400 transition-colors ${location.pathname === '/' ? 'text-purple-400' : ''}`}>Home</Link></li>
            <li><Link to="/articles" className={`hover:text-purple-400 transition-colors ${location.pathname.includes('/articles') ? 'text-purple-400' : ''}`}>Articles</Link></li>
            <li><Link to="/reviews" className={`hover:text-purple-400 transition-colors ${location.pathname.includes('/reviews') ? 'text-purple-400' : ''}`}>Reviews</Link></li>
            {isAdmin && (
              <li><Link to="/admin" className="hover:text-purple-400 transition-colors">Admin</Link></li>
            )}
          </ul>
        </nav>
        
        {searchExpanded ? (
          <div className="relative flex items-center flex-grow md:flex-grow-0">
            <input 
              type="text"
              placeholder="Search..."
              className="bg-gray-800 rounded-full py-2 px-4 pr-10 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-600"
              autoFocus
            />
            <button 
              className="absolute right-3 text-gray-400"
              onClick={() => setSearchExpanded(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button 
            className="text-gray-300 hover:text-white transition-colors"
            onClick={() => setSearchExpanded(true)}
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        
        {isAuthenticated ? (
          <div className="relative" ref={userMenuRef}>
            <button 
              className="flex items-center space-x-2"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <img 
                src="https://picsum.photos/100/100?random=10" 
                alt="User Avatar" 
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden sm:inline">{user?.name || user?.email || 'User'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Login
          </button>
        )}
      </div>
      
      {/* Mobile menu (full screen) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col p-5">
          <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold">
              <span className="text-white">DEMIANZX</span>
              <span className="text-purple-500"> GAMES</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex items-center mb-6">
            <input 
              type="text"
              placeholder="Search..."
              className="bg-gray-800 rounded-full py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button className="absolute right-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-grow">
            <ul className="space-y-6 text-xl">
              <li>
                <Link 
                  to="/" 
                  className={`block hover:text-purple-400 transition-colors ${location.pathname === '/' ? 'text-purple-400' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/articles" 
                  className={`block hover:text-purple-400 transition-colors ${location.pathname.includes('/articles') ? 'text-purple-400' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link 
                  to="/reviews" 
                  className={`block hover:text-purple-400 transition-colors ${location.pathname.includes('/reviews') ? 'text-purple-400' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reviews
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link 
                    to="/admin" 
                    className="block hover:text-purple-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-gray-800">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <img 
                  src="https://picsum.photos/100/100?random=10" 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{user?.name || user?.email || 'User'}</p>
                  <div className="flex space-x-4 mt-2">
                    <Link 
                      to="/profile" 
                      className="text-sm text-gray-400 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      className="text-sm text-gray-400 hover:text-white"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Header;