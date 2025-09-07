import React from 'react';
import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ClerkProvider = ({ children }) => {
  return (
    <BaseClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => {
        // Handle navigation after authentication
        if (to === '/') {
          // After signup/signin, redirect to role selection
          window.location.href = '/role-selection';
        } else {
          window.location.href = to;
        }
      }}
    >
      {children}
    </BaseClerkProvider>
  );
};

export default ClerkProvider;
