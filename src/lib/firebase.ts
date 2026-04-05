import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAWC6xbsQI1pwV1A5nVY_NlT9-lW4SKmbE',
  authDomain: 'mundiales-857e2.firebaseapp.com',
  projectId: 'mundiales-857e2',
  storageBucket: 'mundiales-857e2.firebasestorage.app',
  messagingSenderId: '34690719773',
  appId: '1:34690719773:web:292e22144d4667c9ea66f4',
  measurementId: 'G-CXJM31KVWL',
}

export const app      = initializeApp(firebaseConfig)
export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const provider = new GoogleAuthProvider()
