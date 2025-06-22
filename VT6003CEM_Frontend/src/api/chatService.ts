import axios from 'axios';
import { authService } from './authService';
import type { ChatRoom, Message } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_BASE = `${API_BASE_URL}/chat`;

export const createChatRoomWithOffer = async (placeId: string): Promise<ChatRoom> => {
  const response = await axios.post(`${API_BASE}/offer/${placeId}`, undefined, { headers: authService.getAuthHeader() });
  return response.data;
};

export const getChatRoomsForCurrentUser = async (): Promise<ChatRoom[]> => {
  const response = await axios.get(API_BASE, { headers: authService.getAuthHeader() });
  return response.data;
};

export const getChatRoomById = async (chatRoomId: string): Promise<ChatRoom> => {
  const response = await axios.get(`${API_BASE}/${chatRoomId}`, { headers: authService.getAuthHeader() });
  return response.data;
};

export const sendMessage = async (chatRoomId: string, content: string): Promise<Message> => {
  const response = await axios.post(`${API_BASE}/${chatRoomId}/message`, { content }, { headers: authService.getAuthHeader() });
  return response.data;
};

// Operator: fetch all chat rooms
export const getAllChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await axios.get(`${API_BASE}/all`, { headers: authService.getAuthHeader() });
  return response.data;
};

// Operator: close / delete a chat room
export const closeChatRoom = async (chatRoomId: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_BASE}/${chatRoomId}`, { headers: authService.getAuthHeader() });
  return response.data;
};

// Mark all messages in a chat room as read
export const markMessagesAsRead = async (chatRoomId: string): Promise<void> => {
  // POST /chat/:chatRoomId/read (adjust the endpoint as your backend expects)
  await axios.post(`${API_BASE}/${chatRoomId}/read`, undefined, { headers: authService.getAuthHeader() });
};
