
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import { FIREBASE_CONFIG } from '../constants';

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

export const auth = firebase.auth();
export const db = firebase.database();
export const storage = firebase.storage();
export default firebase;
