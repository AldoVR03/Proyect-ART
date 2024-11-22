import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const useAuth = () => {
  return auth;
};
