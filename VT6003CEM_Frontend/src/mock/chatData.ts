import type { ChatRoom } from '../types/chat';

/**
 * Mock in-memory database for chat rooms.
 * Exported from a separate file to prevent HMR from resetting the state.
 */
export const mockChatRooms: ChatRoom[] = [];
