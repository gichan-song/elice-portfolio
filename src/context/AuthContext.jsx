import { createContext, useState } from 'react';

export const AuthContextStore = createContext({
  token: localStorage.getItem('token') || null,
  nickname: localStorage.getItem('nickname') || null,
  setToken: () => {},
  setNickname: () => {},
});

const AuthContext = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || null);

  return (
    <AuthContextStore.Provider value={{ token, setToken, nickname, setNickname }}>{children}</AuthContextStore.Provider>
  );
};

export default AuthContext;
