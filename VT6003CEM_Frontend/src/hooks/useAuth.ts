import { useState, useEffect } from 'react';

  
  

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<'user' | 'operator' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  
    const token = localStorage.getItem('token');

    if (token) {
  
  
  
      setIsAuthenticated(true);
  
      const storedRole = (localStorage.getItem('role') as 'user' | 'operator' | null);
      if (storedRole) {
        setRole(storedRole);
      } else {
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            setRole(user.role as 'user' | 'operator');
          } else {
            setRole('user');
          }
        } catch {
          setRole('user');
        }
      }
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
    setIsLoading(false);
  }, []);

  return { isAuthenticated, role, isLoading };
};
