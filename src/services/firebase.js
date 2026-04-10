import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCOmxOgiPRhEGdHHgNdHDcZE3om9I2e5W4",
  authDomain: "undercover-game-7d3fb.firebaseapp.com",
  databaseURL: "https://undercover-game-7d3fb-default-rtdb.firebaseio.com",
  projectId: "undercover-game-7d3fb",
  storageBucket: "undercover-game-7d3fb.firebasestorage.app",
  messagingSenderId: "242931621676",
  appId: "1:242931621676:web:14b6aeaaa55f4c64111689",
  measurementId: "G-HVS5HEHT8X"
};

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)