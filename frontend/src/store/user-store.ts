import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';
import type { AuthState } from '@/types/user';

const encrypt = (data: string) =>
    CryptoJS.AES.encrypt(data, import.meta.env.VITE_APP_ENCRYPT_KEY).toString();

const decrypt = (cipher: string) =>
    CryptoJS.AES.decrypt(cipher, import.meta.env.VITE_APP_ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            login: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'auth-storage',
            storage: {
                getItem: (name) => {
                    try {
                        const raw = localStorage.getItem(name);
                        if (!raw) return null;
                        const decrypted = decrypt(raw);
                        return JSON.parse(decrypted);
                    } catch (error) {
                        console.error("Failed to decrypt auth storage", error);
                        return null;
                    }
                },
                setItem: (name, value) => {
                    const stringified = JSON.stringify(value);
                    const encrypted = encrypt(stringified);
                    localStorage.setItem(name, encrypted);
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);
