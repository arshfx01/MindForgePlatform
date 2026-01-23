import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp, query, where, getDocs, Timestamp } from "firebase/firestore";

export interface ScenarioResult {
    id?: string;
    userId: string;
    scenarioId?: string;
    outcome?: any;
    xpEarned: number;
    createdAt?: string | Date; // format for serialization
}

export interface Scenario {
    id?: string;
    title: string;
    description?: string;
    content?: any;
    difficulty?: string;
    category?: string;
    createdAt?: string | Date;
}

const RESULTS_COLLECTION = "scenario_results";
const SCENARIOS_COLLECTION = "scenarios";

// Helper
const convertTimestamps = (data: any): any => {
    const result = { ...data };
    for (const key in result) {
        if (result[key] && typeof result[key].toDate === 'function') {
            result[key] = result[key].toDate().toISOString();
        } else if (result[key] && result[key].seconds !== undefined) {
            result[key] = new Date(result[key].seconds * 1000).toISOString();
        }
    }
    return result;
};


export const GamificationService = {
    async saveScenarioResult(userId: string, resultData: Omit<ScenarioResult, "id" | "userId" | "createdAt">) {
        const data = {
            ...resultData,
            userId,
            createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, RESULTS_COLLECTION), data);
        return { ...resultData, userId, id: docRef.id, createdAt: new Date().toISOString() };
    },

    async getUserHistory(userId: string) {
        const q = query(collection(db, RESULTS_COLLECTION), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data())
        })) as ScenarioResult[];
    },

    async createScenario(scenarioData: Scenario) {
        const data = {
            ...scenarioData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, SCENARIOS_COLLECTION), data);
        return { ...scenarioData, id: docRef.id, createdAt: new Date().toISOString() };
    }
};
