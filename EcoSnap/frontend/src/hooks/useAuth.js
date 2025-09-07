import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userAPI } from '../services/api';

export const useAuth = () => {
    const { user, isLoaded } = useUser();
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            if (!isLoaded) return;

            if (!user) {
                setUserRole('');
                setUserId('');
                setUserData(null);
                setIsLoading(false);
                return;
            }

            try {
                // Check if user has already selected a role
                const userInfo = await userAPI.getUserByClerkId(user.id);

                if (userInfo?.user) {
                    setUserRole(userInfo.user.role);
                    setUserId(userInfo.user.id);
                    setUserData(userInfo.user);

                    // Store in localStorage for persistence
                    localStorage.setItem('userRole', userInfo.user.role);
                    localStorage.setItem('userId', userInfo.user.id);
                    localStorage.setItem('userName', userInfo.user.name);
                } else {
                    // User hasn't selected a role yet
                    setUserRole('');
                    setUserId('');
                    setUserData(null);
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                setUserRole('');
                setUserId('');
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserRole();
    }, [user, isLoaded]);

    const updateUserRole = (role, id, name) => {
        setUserRole(role);
        setUserId(id);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', id);
        localStorage.setItem('userName', name);
    };

    const clearUserData = () => {
        setUserRole('');
        setUserId('');
        setUserData(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    };

    return {
        user,
        isLoaded,
        userRole,
        userId,
        userData,
        isLoading,
        updateUserRole,
        clearUserData,
        isAuthenticated: !!user,
        hasRole: !!userRole,
    };
};
