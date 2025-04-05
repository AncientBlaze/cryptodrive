import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

const useIdStore = create(
    devtools(
        persist(
            (set, get) => ({
                id: null,
                session: null,
                kyc: null,
                setKyc: (kyc) => set({ kyc }),
                setSession: (session) => set({ session }),
                getSession: () => get().session,
                setId: (id) => set({ id }),
                getId: () => get().id,
                clearId: () => set({ id: null }),
                clearSession: () => set({ session: null }),
                restore: async () => {
                    try {
                        const storedData = await AsyncStorage.getItem("id-storage");
                        if (storedData) {
                            const parsedData = JSON.parse(storedData);
                            set(parsedData);
                            return parsedData.id || null;
                        }
                    } catch (error) {
                        console.error("Failed to restore data", error);
                    }
                    return null;
                },
                clearId: () => set({ id: null }),
                clearSession: () => set({ session: null }),
            }),
            {
                name: "id-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);

export default useIdStore;

