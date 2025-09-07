import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userAPI } from '../../services/api';

const RedirectHandler = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isLoaded) return;

      // If user is not authenticated, redirect to sign in
      if (!user) {
        navigate('/signin');
        return;
      }

      // First check if we have role data in localStorage (user just completed role selection)
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      
      if (storedRole && storedUserId) {
        // User has role data in localStorage, redirect to dashboard
        navigate('/dashboard');
        return;
      }

      try {
        // Check if user has already selected a role
        const userData = await userAPI.getUserByClerkId(user.id);
        
        if (userData?.user) {
          // User already has a role, store data and redirect to dashboard
          localStorage.setItem('userRole', userData.user.role);
          localStorage.setItem('userId', userData.user.id);
          localStorage.setItem('userName', userData.user.name);
          navigate('/dashboard');
        } else {
          // User needs to select a role
          navigate('/role-selection');
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
        // If there's an error and no stored data, redirect to role selection
        navigate('/role-selection');
      }
    };

    handleRedirect();
  }, [user, isLoaded, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;
