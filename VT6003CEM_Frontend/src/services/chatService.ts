import type { ChatRoom, Message, UserInfo } from '../types/chat';
import type { HotelInfo } from '../types/hotel';
import { mockChatRooms } from '../mock/chatData';

  
  
const mockCurrentUser: UserInfo = {
  id: 'user-123',
  name: 'Current User',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

  
  
const mockOperatorUser: UserInfo = {
    id: 'operator-456',
    name: 'Hotel Operator',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
};


export const createChatRoomWithOffer = (
  hotel: HotelInfo,
  interestedUser: UserInfo = mockCurrentUser
): ChatRoom => {
  const chatRoomId = `chat_${hotel.place_id}_${interestedUser.id}`;

  
  const existingRoom = mockChatRooms.find(room => room.id === chatRoomId);
  if (existingRoom) {
    console.log('Returning existing chat room:', existingRoom);
    return existingRoom;
  }

  const initialMessage: Message = {
    id: `msg_${Date.now()}`,
    chatRoomId,
    senderId: interestedUser.id,
    content: `I am interested in making an offer for ${hotel.name}.`,
    timestamp: new Date(),
    status: 'sent',
  };

  const newChatRoom: ChatRoom = {
    id: chatRoomId,
    participants: [interestedUser, mockOperatorUser],
    messages: [initialMessage],
    hotel: {
      place_id: hotel.place_id,
      name: hotel.name,
      formatted_address: hotel.formatted_address,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockChatRooms.push(newChatRoom);
  console.log('New chat room created:', newChatRoom);
  return newChatRoom;
};

export const getChatRoomById = (chatRoomId: string): ChatRoom | null => {
  const room = mockChatRooms.find(r => r.id === chatRoomId);
  return room || null;
};


export const getChatRoomsForUser = (userId: string): ChatRoom[] => {
  return mockChatRooms
    .filter(room => room.participants.some(p => p.id === userId))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};
