import admin from 'firebase-admin';

// Import Firestore types (can probably remove this import, its unused)
import { Firestore } from 'firebase-admin/firestore';

export interface INews {
    title: string;
    body: string;
    source: string;
    image?: string;
    location: {
        latitude: number;
        longitude: number;
    };
    createdAt?: admin.firestore.Timestamp;  // Using the Firestore type for timestamps
}
