import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  userRole: 'admin' | 'agent' | 'public';
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userRole: 'public',
  isLoading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<'admin' | 'agent' | 'public'>('public');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setUserRole('public');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Check user role from user_roles table
        const { data: rolesData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .limit(1)
          .single();

        if (error || !rolesData) {
          // Default to agent if no role found but authenticated
          setUserRole('agent');
        } else {
          setUserRole(rolesData.role as 'admin' | 'agent');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUserRole('public');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUserRole('public');
        setIsAuthenticated(false);
        setIsLoading(false);
      } else {
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
