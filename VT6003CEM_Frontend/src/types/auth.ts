export interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  isOperator: boolean;
  token: string;
}
