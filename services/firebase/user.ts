import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";

export interface UserProfile {
    id: string; // auth.uid
    email?: string;
    fullName?: string;
    xp?: number;
    level?: number;
    streak?: number;
    statsLogic?: number;
    statsFlexibility?: number;
    statsEthics?: number;
    onboardingCompleted?: boolean;
    createdAt?: string | Date; // Changed to string/Date for serialization
    // New Fields
    energy?: number;
    energyLastReplenish?: string | Date;
    onboardingStep?: number;
    onboardingQuestions?: any; // JSON
    lastSeen?: string | Date;
    updatedAt?: string | Date;
}

const COLLECTION_NAME = "profiles";

// Helper to convert Firestore Timestamp to Date/String
const convertTimestamps = (data: any): any => {
    const result = { ...data };
    for (const key in result) {
        if (result[key] && typeof result[key].toDate === 'function') {
            result[key] = result[key].toDate().toISOString(); // Using ISO string for max safety with Server Actions
        } else if (result[key] && result[key].seconds !== undefined && result[key].nanoseconds !== undefined) {
            // Handle raw timestamp object if toDate missing (client vs server SDK nuances)
            result[key] = new Date(result[key].seconds * 1000).toISOString();
        }
    }
    return result;
};

export const UserService = {
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        const docRef = doc(db, COLLECTION_NAME, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return { id: docSnap.id, ...convertTimestamps(data) } as UserProfile;
        } else {
            return null;
        }
    },

    async createUserProfile(userId: string, data: Partial<UserProfile>) {
        const docRef = doc(db, COLLECTION_NAME, userId);
        // Use serverTimestamp for DB, but we need to return a prediction or wait.
        // simpler to just write and return what we have with current time.

        // We can't put direct Date objects into setDoc if we want serverTimestamp, 
        // but here we are mixing. Let's use serverTimestamp() for the DB write.

        const dbData: any = {
            ...data,
            id: userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            xp: data.xp ?? 0,
            level: data.level ?? 1,
            streak: data.streak ?? 0,
            statsLogic: data.statsLogic ?? 10,
            statsFlexibility: data.statsFlexibility ?? 10,
            statsEthics: data.statsEthics ?? 10,
            energy: data.energy ?? 3,
            onboardingCompleted: data.onboardingCompleted ?? false,
            onboardingStep: data.onboardingStep ?? 0,
        };

        // Remove undefined
        Object.keys(dbData).forEach(key => dbData[key] === undefined && delete dbData[key]);

        await setDoc(docRef, dbData, { merge: true });

        // Return values with simulated timestamps for immediate UI usage
        return {
            ...data,
            id: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as UserProfile;
    },

    async updateUserProfile(userId: string, data: Partial<UserProfile>) {
        const docRef = doc(db, COLLECTION_NAME, userId);
        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        // If we passed ISO strings in 'data' for dates (like lastSeen), we might want to convert them BACK to Timestamps or valid Dates for Firestore?
        // Firestore SDK handles Date objects fine.
        // If data has strings that look like dates? Firestore saves them as strings unless we convert.
        // Better to ensure callers pass Dates or we handle it.
        // For now, let's assume callers might pass Date objects for updates (like energyLastReplenish).
        // But if we defined UserProfile interface with strings | Date, we need to be careful.

        // Explicit conversion for known date fields if they are strings
        if (typeof updateData.lastSeen === 'string') updateData.lastSeen = new Date(updateData.lastSeen);
        if (typeof updateData.energyLastReplenish === 'string') updateData.energyLastReplenish = new Date(updateData.energyLastReplenish);

        await updateDoc(docRef, updateData);
    },

    async updateOnboardingQuestions(userId: string, questions: any) {
        return this.updateUserProfile(userId, { onboardingQuestions: questions });
    }
};
