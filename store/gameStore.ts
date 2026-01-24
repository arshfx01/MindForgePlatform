import { create } from 'zustand';
// import { supabase } from '@/services/supabase/client'; // REMOVED
import { initializeUser, updateProfile, checkDailyStreak, consumeEnergy } from '@/app/actions/game';
import { db } from '@/lib/firebase'; // Direct firestore for realtime could go here if needed, but keeping it simple first
import { doc, onSnapshot } from 'firebase/firestore';

interface GameState {
    // Identity
    userId: string | null;

    // Progression
    xp: number;
    level: number;
    streak: number;
    energy: number;
    maxEnergy: number;
    lastEnergyUpdate: string | null;

    // Stats
    stats: {
        logic: number;
        flexibility: number;
        ethics: number;
    };

    onboardingCompleted: boolean;
    onboardingQuestions: any[];
    onboardingStep: number;
    initialized: boolean;

    // UI Triggers
    showStreakAnimation: boolean;
    pointsEarned: number | null;
    lastArenaScore: number | null;


    // Actions
    setUserId: (id: string) => void;
    fetchProfile: () => Promise<void>;
    updateProfile: (updates: Partial<GameState>) => Promise<void>;
    checkStreak: () => Promise<boolean>;
    initializeGame: (userId: string) => Promise<void>;
    consumeEnergy: () => Promise<boolean>;
    refillEnergy: () => void;
    setShowStreakAnimation: (show: boolean) => void;
    setPointsEarned: (points: number | null) => void;
    setLastArenaScore: (score: number | null) => void;
}


export const useGameStore = create<GameState>((set, get) => ({
    userId: null,
    xp: 0,
    level: 1,
    streak: 0,
    energy: 3,
    maxEnergy: 3,
    lastEnergyUpdate: null,
    stats: { logic: 10, flexibility: 10, ethics: 10 },
    onboardingCompleted: false,
    onboardingQuestions: [],
    onboardingStep: 0,
    initialized: false,
    showStreakAnimation: false,
    pointsEarned: null,
    lastArenaScore: null,

    setUserId: (id) => set({ userId: id }),

    setLastArenaScore: (score: number | null) => set({ lastArenaScore: score }),


    fetchProfile: async () => {
        const { userId } = get();
        if (!userId) return;

        // Call server action which calls Firebase Admin/Client
        // actually app/actions/game calls UserService (Admin SDK or Client SDK depending on context)
        // Since 'use server' actions run on server, it uses the logic defined there.
        // Wait, app/actions/game uses `services/firebase/user` which uses @/lib/firebase (Client SDK). 
        // This is fine for nextjs server components/actions too usually, but creates a connection per call.
        const { getUserProfile } = await import('@/app/actions/game');
        const data: any = await getUserProfile(userId);

        if (data) {
            // Energy Calculation Logic (Client side or just trust server)
            const lastUpdate = data.energyLastReplenish
                ? (data.energyLastReplenish.toDate ? data.energyLastReplenish.toDate() : new Date(data.energyLastReplenish))
                : new Date();
            const now = new Date();
            const hoursPassed = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

            let currentEnergy = data.energy ?? 3;
            // logic is already in initializeUser on server, but good to have display logic here
            // We'll trust the data from server mostly

            set({
                xp: data.xp ?? 0,
                level: data.level ?? 1,
                streak: data.streak ?? 0,
                energy: currentEnergy,
                lastEnergyUpdate: lastUpdate.toISOString(),
                onboardingCompleted: data.onboardingCompleted ?? false,
                onboardingQuestions: data.onboardingQuestions || [],
                onboardingStep: data.onboardingStep || 0,
                stats: {
                    logic: data.statsLogic ?? 10,
                    flexibility: data.statsFlexibility ?? 10,
                    ethics: data.statsEthics ?? 10,
                },
            });
        }
    },

    updateProfile: async (updates) => {
        const { userId } = get();
        if (!userId) return;

        // Optimistic Update
        // @ts-ignore
        set((state) => ({ ...state, ...updates }));

        const dbUpdates: any = {};
        if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
        if (updates.level !== undefined) dbUpdates.level = updates.level;
        if (updates.onboardingCompleted !== undefined) dbUpdates.onboardingCompleted = updates.onboardingCompleted;
        if (updates.onboardingQuestions !== undefined) dbUpdates.onboardingQuestions = updates.onboardingQuestions;
        if (updates.onboardingStep !== undefined) dbUpdates.onboardingStep = updates.onboardingStep;
        if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
        if (updates.energy !== undefined) dbUpdates.energy = updates.energy;

        if (updates.stats) {
            dbUpdates.statsLogic = updates.stats.logic;
            dbUpdates.statsFlexibility = updates.stats.flexibility;
            dbUpdates.statsEthics = updates.stats.ethics;
        }

        await updateProfile(userId, dbUpdates);
    },

    checkStreak: async () => {
        const { userId } = get();
        if (!userId) return false;

        const result = await checkDailyStreak(userId);

        if (result) {
            set({ streak: result.streak, showStreakAnimation: result.showAnimation });
            return result.showAnimation;
        }
        return false;
    },

    initializeGame: async (userId: string) => {
        await initializeUser(); // Server action to ensure profile exists

        set({ userId });
        await get().fetchProfile();
        await get().checkStreak();
        set({ initialized: true });

        // Firebase Realtime Listener
        const unsub = onSnapshot(doc(db, "profiles", userId), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                set({
                    xp: data.xp ?? 0,
                    level: data.level ?? 1,
                    streak: data.streak ?? 0,
                    energy: data.energy,
                    onboardingCompleted: data.onboardingCompleted,
                    onboardingStep: data.onboardingStep,
                    stats: {
                        logic: data.statsLogic ?? 10,
                        flexibility: data.statsFlexibility ?? 10,
                        ethics: data.statsEthics ?? 10
                    }
                });
            }
        });

        // return unsub; // Store won't handle unsubscription easily here, but for singleton store it's ok.
    },

    consumeEnergy: async () => {
        const { userId, energy } = get();
        if (!userId || energy <= 0) return false;

        const newEnergy = energy - 1;
        set({ energy: newEnergy });

        const success = await consumeEnergy(userId);

        if (!success) {
            set({ energy }); // Revert
            return false;
        }

        return true;
    },

    refillEnergy: () => set({ energy: 3 }),
    setShowStreakAnimation: (show) => set({ showStreakAnimation: show }),
    setPointsEarned: (points) => set({ pointsEarned: points }),
}));
