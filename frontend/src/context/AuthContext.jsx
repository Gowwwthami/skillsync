import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/auth/me`);
      setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await axios.put(`${API_BASE}/users/profile`, profileData);
    setUser(data.user);
    return data;
  };

  // Fetch latest profile from backend
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/users/profile`);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      return null;
    }
  };

  // Save profile data to backend
  const saveProfile = async (profileData) => {
    const { data } = await axios.put(`${API_BASE}/users/profile`, profileData);
    setUser(data.user);
    return data;
  };

  // Forgot password - Send OTP
  const forgotPassword = async (email) => {
    const { data } = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return data;
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    const { data } = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
    return data;
  };

  // Reset password with OTP
  const resetPassword = async (email, otp, newPassword) => {
    const { data } = await axios.post(`${API_BASE}/auth/reset-password`, { email, otp, newPassword });
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Google OAuth
  const googleAuth = async (credential) => {
    // Decode JWT to get user info
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const { email, name, sub: googleId } = JSON.parse(jsonPayload);
    
    const { data } = await axios.post(`${API_BASE}/auth/google`, { 
      email, 
      name, 
      googleId 
    });
    
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile,
      fetchProfile,
      saveProfile,
      forgotPassword,
      verifyOTP,
      resetPassword,
      googleAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);