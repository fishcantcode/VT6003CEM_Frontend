import axios from 'axios';
import type { HotelInfo, HotelStatus } from '../types/hotel';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_BASE = `${API_BASE_URL}/hotel`;

export const getAllHotels = async (): Promise<HotelInfo[]> => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const getHotelById = async (placeId: string): Promise<HotelInfo> => {
  const response = await axios.get(`${API_BASE}/place/${placeId}`);
  return response.data;
};

export const createHotel = async (hotel: Partial<HotelInfo>): Promise<HotelInfo> => {
  const response = await axios.post(API_BASE, hotel);
  return response.data;
};

export const updateHotel = async (placeId: string, hotel: Partial<HotelInfo>): Promise<HotelInfo> => {
  const response = await axios.put(`${API_BASE}/place/${placeId}`, hotel);
  return response.data;
};

export const deleteHotel = async (placeId: string): Promise<{ success: boolean }> => {
  const response = await axios.delete(`${API_BASE}/place/${placeId}`);
  return response.data;
};

export const updateHotelStatus = async (placeId: string, status: 'available' | 'unavailable'): Promise<HotelInfo> => {
  const response = await axios.patch(`${API_BASE}/place/${placeId}/status`, { status });
  return response.data;
};

export const searchHotels = async (query: string): Promise<HotelInfo[]> => {
  const response = await axios.get(`${API_BASE}/search?name=${encodeURIComponent(query)}`);
  return response.data;
};

export const getHotelsByStatus = async (status: HotelStatus): Promise<HotelInfo[]> => {
  const response = await axios.get(`${API_BASE}/status/${status}`);
  return response.data;
};

  
export const getFavoriteHotels = async (): Promise<HotelInfo[]> => {
  const response = await axios.get(`${API_BASE}/favorites`);
  return response.data;
};

export const addFavoriteHotel = async (placeId: string): Promise<{ success: boolean }> => {
  const response = await axios.post(`${API_BASE}/place/${placeId}/favorite`);
  return response.data;
};

export const removeFavoriteHotel = async (placeId: string): Promise<{ success: boolean }> => {
  const response = await axios.delete(`${API_BASE}/place/${placeId}/favorite`);
  return response.data;
};
