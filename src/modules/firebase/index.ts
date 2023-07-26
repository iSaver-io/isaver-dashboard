import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, doc, getFirestore } from 'firebase/firestore';

// This config does not lead to security errors, so we can store it right here
const firebaseConfig = {
  apiKey: 'AIzaSyClCTE9QpSsOYjQd3ufUw849LCEOUIjcJU',
  authDomain: 'isaver-6e196.firebaseapp.com',
  projectId: 'isaver-6e196',
  storageBucket: 'isaver-6e196.appspot.com',
  messagingSenderId: '310227356933',
  appId: '1:310227356933:web:b3d65b867f311f11723b6c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const configCollection = collection(db, 'parameters');
const configDoc = doc(db, '/parameters/config');
const rafflesCollection = collection(db, 'lottery_params');

export { app, auth, configCollection, configDoc, db, rafflesCollection };
