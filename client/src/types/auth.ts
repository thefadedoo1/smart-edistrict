export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "CITIZEN" | "DA" | "PATWARI" | "TEHSILDAR" | "ADMIN";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}