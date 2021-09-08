import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export const firebaseConfig = {
    apiKey: "AIzaSyCQuDQKiX6LH2IF2oM7z2YJO7MWnSebVcc",
    authDomain: "react-app-journal-124a6.firebaseapp.com",
    projectId: "react-app-journal-124a6",
    storageBucket: "react-app-journal-124a6.appspot.com",
    messagingSenderId: "116104769604",
    appId: "1:116104769604:web:57c128f3ed66ded3eacc11"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  export {
      db,
      googleAuthProvider,
      firebase
  }