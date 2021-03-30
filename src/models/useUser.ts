import { useState, useCallback } from 'react';

export default function useUser() {
  const [user, setUser] = useState<boolean>(false);

  const signin = useCallback((account, password) => {
    setUser(true);
  }, []);

  const signout = useCallback(() => {
    setUser(false);
  }, []);

  return {
    user,
    signin,
    signout,
  };
}