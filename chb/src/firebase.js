import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/database"
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyCzL8k4zI2AlRvr5OpEJPlbb5tdw3IJLgI",
    authDomain: "react-slack-clone-abbf3.firebaseapp.com",
    databaseURL: "https://react-slack-clone-abbf3.firebaseio.com",
    projectId: "react-slack-clone-abbf3",
    storageBucket: "react-slack-clone-abbf3.appspot.com",
    messagingSenderId: "717226499587",
    appId: "1:717226499587:web:788956d2c89734d9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase