export interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  token: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
  };
  role: 'user' | 'operator' | 'admin';
  isEmployee: boolean;
  avatarImage?: string;
  createdAt: string;
  updatedAt: string;
}