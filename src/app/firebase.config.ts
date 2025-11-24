import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA9n6ohKWqks81uRtfbne4vPnjT2MpfQ30",
  authDomain: "aifactory-e108d.firebaseapp.com",
  projectId: "aifactory-e108d",
 storageBucket: "aifactory-e108d.appspot.com",
  messagingSenderId: "573607656562",
  appId: "1:573607656562:web:317345735d898b74ea16eb",
  measurementId: "G-EB7D96WFPH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);