import type { HotelInfo } from './hotel';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatarImage?: string;
  profile?: string;
  role?: 'user' | 'operator';
}

export interface Message {
  id: string; 
  chatRoomId: string; 
  senderId: number; 
  content: string;
  timestamp: string;
  sender: UserInfo;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatRoom {
  id: string; 
  participants: UserInfo[]; 
  messages: Message[]; 
  hotel: Pick<HotelInfo, 'place_id' | 'name' | 'formatted_address'>; 
  createdAt: Date;
  updatedAt: Date; 
}

export type ChatMessage = Message;
export type ChatRoomWithDetails = ChatRoom;

export interface CreateChatRequest {
  place_id: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ChatRoomListResponse {
  chatRooms: ChatRoom[];
}
