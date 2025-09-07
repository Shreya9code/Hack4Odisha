import React, { useState, useEffect } from 'react';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ onMenuToggle }) => {
  const { user } = useUser();
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user info from localStorage
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedName) {
      setUserName(storedName);
    } else if (user?.fullName) {
      setUserName(user.fullName);
    }
    
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, [user]);

  const handleSignOut = () => {
    // Clear all localStorage data
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    console.log('LocalStorage cleared on sign out');
  };

  // Show auth buttons only on home page
  const showAuthButtons = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        {onMenuToggle && (
          <button className="md:hidden mr-3 text-gray-600" onClick={onMenuToggle}>
            <i className="fas fa-bars text-xl"></i>
          </button>
        )}
                 <h2 className="text-xl font-semibold">
           {showAuthButtons ? (
             <span className="!bg-gradient-to-r from-emerald-600 to-teal-600 !bg-clip-text text-transparent">
               E-Waste Raah
             </span>
           ) : (
             userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard` : 'Dashboard'
           )}
         </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {showAuthButtons ? (
          // Auth buttons for Home page
          <div className="flex items-center space-x-3">
            <Link
              to="/signin"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md active:translate-y-0"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md active:translate-y-0"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          // Regular header content for dashboard pages
          <>
            <div className="relative">
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <i className="fas fa-bell"></i>
                <span className="absolute -top-1 -right-1 !bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">3</span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-10">
                  <div className="px-4 py-2 border-b">
                    <h3 className="text-sm font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-3 hover:!bg-gray-50">
                      <p className="text-sm">New e-waste item added to inventory</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                    <div className="px-4 py-3 hover:!bg-gray-50">
                      <p className="text-sm">Your recycling report for July is ready</p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                    <div className="px-4 py-3 hover:!bg-gray-50">
                      <p className="text-sm">New campaign launched: E-Waste Awareness Week</p>
                      <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="border rounded-full py-1 px-4 text-sm pl-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-2 text-gray-400"></i>
            </div>
            
            <div className="relative">
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 rounded-full !bg-green-200 flex items-center justify-center">
                  <i className="fas fa-user text-green-600"></i>
                </div>
                <span className="text-sm hidden md:block">{userName}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                                 <div className="px-4 py-2 border-b">
                 <p className="text-sm font-medium">{userName}</p>
                 <p className="text-xs text-gray-500">{userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)}` : 'User'}</p>
               </div>
               {user && (
                 <>
                   <button className="w-full text-left px-4 py-2 text-sm hover:!bg-gray-50 flex items-center">
                     <i className="fas fa-cog mr-2 text-gray-500"></i> Settings
                   </button>
                   <SignOutButton signOutCallback={handleSignOut}>
                     <button className="w-full text-left px-4 py-2 text-sm hover:!bg-gray-50 flex items-center text-red-600">
                       <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                     </button>
                   </SignOutButton>
                 </>
               )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;