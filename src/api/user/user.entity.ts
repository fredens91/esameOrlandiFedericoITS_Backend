export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role?: string;
  isSubscribed?: boolean;
}
