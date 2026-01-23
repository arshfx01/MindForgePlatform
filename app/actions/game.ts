'use server'

import { UserService, UserProfile } from '@/services/firebase/user'
import { GamificationService } from '@/services/firebase/gamification'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function getUserProfile(userId: string) {
    if (!userId) return null;
    try {
        return await UserService.getUserProfile(userId);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function initializeUser() {
    const { userId } = await auth();
    if (!userId) return null;

    try {
        let profile = await UserService.getUserProfile(userId);

        if (!profile) {
            profile = await UserService.createUserProfile(userId, {
                xp: 0,
                level: 1,
                streak: 0,
                statsLogic: 10,
                statsFlexibility: 10,
                statsEthics: 10,
                energy: 3,
                onboardingCompleted: false,
                onboardingStep: 0,
                // email: "" // Clerk handles email
            });
        }

        // Check energy refill
        if (profile && (profile.energy ?? 0) < 3) {
            const lastReplenish = profile.energyLastReplenish
                ? (profile.energyLastReplenish as any).toDate ? (profile.energyLastReplenish as any).toDate() : new Date((profile.energyLastReplenish as any))
                : null;

            if (!lastReplenish || (new Date().getTime() - lastReplenish.getTime() > 10 * 60 * 60 * 1000)) {
                await UserService.updateUserProfile(userId, {
                    energy: 3,
                    energyLastReplenish: new Date()
                });
                profile.energy = 3;
            }
        }

        return profile;
    } catch (error) {
        console.error("Error initializing user:", error);
        return null;
    }
}

export async function updateProfile(userId: string, data: any) {
    if (!userId) return null;
    try {
        await UserService.updateUserProfile(userId, data);
        revalidatePath('/');
        return await UserService.getUserProfile(userId);
    } catch (e) {
        console.error("Update profile failed", e);
        return null;
    }
}

export async function saveScenarioResult(userId: string, scenarioId: string | null, result: any, xpEarned: number, newStats?: any) {
    if (!userId) return null;

    try {
        // 1. Save Result
        const savedResult = await GamificationService.saveScenarioResult(userId, {
            scenarioId: scenarioId || undefined,
            outcome: result,
            xpEarned
        });

        // 2. Update User XP and Level
        const profile = await UserService.getUserProfile(userId);
        if (profile) {
            const newXp = (profile.xp || 0) + xpEarned;
            const newLevel = Math.floor(newXp / 1000) + 1;

            const updates: any = {
                xp: newXp,
                level: newLevel,
            };

            if (newStats) {
                if (newStats.logic) updates.statsLogic = newStats.logic;
                if (newStats.flexibility) updates.statsFlexibility = newStats.flexibility;
                if (newStats.ethics) updates.statsEthics = newStats.ethics;
            }

            await UserService.updateUserProfile(userId, updates);

            return { savedResult, newXp, newLevel };
        }

        return null;
    } catch (error) {
        console.error("Error saving scenario result:", error);
        return null; // Or throw
    }
}

export async function checkDailyStreak(userId: string) {
    if (!userId) return null;
    try {
        const profile = await UserService.getUserProfile(userId);
        if (!profile) return null;

        const lastSeen = profile.lastSeen
            ? ((profile.lastSeen as any).toDate ? (profile.lastSeen as any).toDate() : new Date(profile.lastSeen as any))
            : null;
        const now = new Date();
        const today = now.toDateString();

        let newStreak = profile.streak ?? 0;
        let showAnim = false;

        if (lastSeen) {
            const lastSeenDate = lastSeen.toDateString();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const yesterdayString = yesterday.toDateString();

            if (lastSeenDate === today) {
                return { streak: newStreak, showAnimation: false };
            }

            if (lastSeenDate === yesterdayString) {
                newStreak += 1;
                showAnim = true;
            } else {
                newStreak = 1; // Reset
                showAnim = true;
            }
        } else {
            newStreak = 1;
            showAnim = true;
        }

        await UserService.updateUserProfile(userId, {
            streak: newStreak,
            lastSeen: now
        });

        return { streak: newStreak, showAnimation: showAnim };

    } catch (e) {
        console.error("Check streak failed", e);
        return null;
    }
}

export async function consumeEnergy(userId: string) {
    if (!userId) return false;
    try {
        const profile = await UserService.getUserProfile(userId);
        if (!profile || (profile.energy ?? 0) <= 0) return false;

        await UserService.updateUserProfile(userId, {
            energy: (profile.energy ?? 0) - 1
        });
        return true;
    } catch (e) {
        console.error("Consume energy failed", e);
        return false;
    }
}

export async function getLeaderboard(limit = 10) {
    // Basic implementation - Firestore requires an Index for sorting
    // We'll return empty for now or fetch all users locally (inefficient strictly but ok for small apps)
    // Real implementation should be in GamificationService
    return [];
}
