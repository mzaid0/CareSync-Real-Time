// types/user.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "caregiver" | "family_member" | "admin";
  contact?: string;
  languagePreference?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  contact: string;
  role: "user" | "caregiver" | "family_member" | "admin";
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse extends ApiResponse<User> {
  token: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  token:string
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}