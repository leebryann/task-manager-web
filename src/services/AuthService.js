// src/services/AuthService.js

import axios from 'axios';

const API_URL = "http://localhost:8080/api/v1";

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  const token = response.data.token;
  localStorage.setItem("jwtToken", token);
  return response;
};

export const logout = () => {
  localStorage.removeItem("jwtToken");
};

export const getToken = () => localStorage.getItem("jwtToken");
