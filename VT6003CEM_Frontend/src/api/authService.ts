import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; 

export interface SignupData {
  name: string;
  email: string;
  password: string;
  isOperator: boolean;
  operatorCode?: string; 
}

export const authService = {
  async signup(userData: SignupData) {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};
