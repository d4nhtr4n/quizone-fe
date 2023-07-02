// Initialize the config of Firebase
import { initializeApp } from '@firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDbKdHam31vGfa2GAG8lgovJGbf9PRMpkI',
  authDomain: 'quizone-4c0c5.firebaseapp.com',
  projectId: 'quizone-4c0c5',
  storageBucket: 'quizone-4c0c5.appspot.com',
  messagingSenderId: '506485239567',
  appId: '1:506485239567:web:f59cfac42cf9a2e38ad87a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
