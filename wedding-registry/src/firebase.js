import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  writeBatch,
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
const PRODUCTS = "products";

// ── Products ──────────────────────────────────────────────────────────────────

export function subscribeProducts(callback) {
  const q = query(collection(db, PRODUCTS), orderBy("order", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      callback(items);
    },
    (err) => console.error("Products subscribe error:", err)
  );
}

export async function addProduct(product) {
  const { id, ...data } = product;
  return await setDoc(doc(db, PRODUCTS, id), data);
}

export async function deleteProduct(id) {
  return await deleteDoc(doc(db, PRODUCTS, id));
}

export async function updateProduct(id, data) {
  return await updateDoc(doc(db, PRODUCTS, id), data);
}

export async function seedProducts(items) {
  const batch = writeBatch(db);
  items.forEach((item, i) => {
    const { id, ...data } = item;
    batch.set(doc(db, PRODUCTS, id), { ...data, order: i });
  });
  return await batch.commit();
}

// ── Reservations ──────────────────────────────────────────────────────────────

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
    (err) => console.error("Firestore subscribe error:", err)
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
