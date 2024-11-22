import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const firebaseConfig = {
    apiKey: "AIzaSyCU2Iaj6xEJPguVm7JQXSFcOJXx8ifDkAQ",
    authDomain: "project-art-eac2d.firebaseapp.com",
    projectId: "project-art-eac2d",
    storageBucket: "project-art-eac2d.appspot.com",
    messagingSenderId: "646583085221",
    appId: "1:646583085221:web:0aab11a340ee856449854c"
};

const app = initializeApp(firebaseConfig);

// Auth de Firebase
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Constante de Firestore
const firestore = getFirestore(app);

// Constante de Storage
const storage = getStorage(app); 

export { app, auth, firestore, storage };
