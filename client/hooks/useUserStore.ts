import { create } from 'zustand';
import { getUserProfile, loginUser } from '@/utils/api/userApi';


interface UserState {
    walletAddress: string | null;
    username: string | null;
    reputation: number | null;
    isConnected: boolean;
    isLoading: boolean;
    showUsernamePrompt: boolean;

    login: (walletAddress: string) => Promise<void>;
    register: (username: string) => Promise<void>;
    logout: () => void;
    closePrompt: () => void;
    }

    export const useUserStore = create<UserState>((set, get) => ({
    walletAddress: null,
    username: null,
    reputation: null,
    isConnected: false,
    isLoading: false,
    showUsernamePrompt: false,

    // --- Login Action  ---
    login: async (walletAddress) => {
        set({ isLoading: true, isConnected: true, walletAddress });
        try {
        const user = await getUserProfile(walletAddress);
        // User exists
        if (user.username) {
            set({
            username: user.username,
            reputation: user.reputation,
            showUsernamePrompt: false,
            isLoading: false,
            });
        } else {
            // User exists but has no username (legacy)
            console.log("User exists but missing username");
            set({
            username: null,
            reputation: user.reputation, // We might have reputation data
            showUsernamePrompt: true,
            isLoading: false,
            });
        }
        } catch (error: any) {
        // New user (404) or other error
        const errorMsg = error.response?.data?.message || error.message || "An unknown error occurred";
        if (errorMsg.includes('User not found') || errorMsg.includes('404')) {
            console.log("New user detected");
            set({
            username: null,
            reputation: null, // New user has no rep yet
            showUsernamePrompt: true,
            isLoading: false,
            });
        } else {
            console.error("Error checking user:", errorMsg);
            set({ isLoading: false, isConnected: false }); // Logout on other errors
        }
        }
    },

    // --- Register Action ---
    register: async (username) => {
        const walletAddress = get().walletAddress;
        if (!walletAddress || !username.trim()) {
        alert("⚠️ Wallet address not found or username is empty!");
        return;
        }

        set({ isLoading: true });
        try {
        // loginUser API handles both login and registration
        const user = await loginUser(walletAddress, username);
        console.log("User registered:", user);
        set({
            username: user.username,
            reputation: user.reputation,
            showUsernamePrompt: false,
            isLoading: false,
        });
        } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || "Failed to register";
        console.error("Failed to register:", errorMsg);
        alert(errorMsg); // Show the specific error (e.g., "Username already taken")
        set({ isLoading: false });
        }
    },

    // --- Logout Action ---
    logout: () => {
        set({
        walletAddress: null,
        username: null,
        reputation: null,
        isConnected: false,
        showUsernamePrompt: false,
        isLoading: false,
        });
    },

    // --- Close Modal Action ---
    closePrompt: () => {
        set({ showUsernamePrompt: false });
    },
}));