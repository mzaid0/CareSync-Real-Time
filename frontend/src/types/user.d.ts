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

export interface ApiResponse<T> {
  message: string;
  data: T;
}
