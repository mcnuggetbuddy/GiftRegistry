import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const RESERVATIONS = "reservations";

// Subscribe to live reservations. Returns unsubscribe function.
export function subscribeReservations(callback) {
  const q = query(collection(db, RESERVATIONS), orderBy("ts", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const grouped = {};
      snap.forEach((d) => {
        const data = d.data();
        if (!grouped[data.itemId]) grouped[data.itemId] = [];
        grouped[data.itemId].push({ docId: d.id, name: data.name, qty: data.qty });
      });
      callback(grouped);
    },
    (err) => {
      console.error("Firestore subscribe error:", err);
    }
  );
}

export async function addReservation(itemId, name, qty) {
  return await addDoc(collection(db, RESERVATIONS), {
    itemId,
    name,
    qty,
    ts: serverTimestamp(),
  });
}

export async function removeReservation(docId) {
  return await deleteDoc(doc(db, RESERVATIONS, docId));
}
