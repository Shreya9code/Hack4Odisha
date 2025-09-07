import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';

const AuthCallback = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoaded) return;

      if (!user) {
        // User is not authenticated, redirect to sign in
        navigate('/signin');
        return;
      }

      try {
        // Check if user has already selected a role
        const userData = await userAPI.getUserByClerkId(user.id);
        
        if (userData?.user) {
          // User already has a role, redirect to dashboard
          localStorage.setItem('userRole', userData.user.role);
          localStorage.setItem('userId', userData.user.id);
          localStorage.setItem('userName', userData.user.name);
          navigate('/dashboard');
        } else {
          // User needs to select a role
          navigate('/role-selection');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        // If there's an error, redirect to role selection
        navigate('/role-selection');
      }
    };

    handleCallback();
  }, [user, isLoaded, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Setting up your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
