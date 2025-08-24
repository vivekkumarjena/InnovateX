import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');


// fetch current user from cookie on app load
useEffect(() => {
(async () => {
try {
const { data } = await api.get('/api/auth/me');
setUser(data.user);
} catch (e) {
setUser(null);
} finally {
setLoading(false);
}
})();
}, []);


const login = async (email, password) => {
setError('');
const { data } = await api.post('/api/auth/login', { email, password });
setUser(data.user);
return data.user;
};


const register = async (fullName, email, password) => {
setError('');
const { data } = await api.post('/api/auth/register', { fullName, email, password });
setUser(data.user);
return data.user;
};


const logout = async () => {
await api.post('/api/auth/logout');
setUser(null);
};


const value = { user, loading, error, login, register, logout };
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export const useAuth = () => useContext(AuthContext);