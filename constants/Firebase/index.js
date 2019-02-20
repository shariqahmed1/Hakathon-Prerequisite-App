import * as firebase from 'firebase';
import 'firebase/firestore';
import firestore from 'firebase/firestore';

// const settings = {timestampsInSnapshots: true};

// const firestore = new Firestore();

const config = {
  apiKey: "AIzaSyBoTC-8YVUY7bP4-3X7a-B-_UCG7ocPviM",
  authDomain: "prerequisiteapp.firebaseapp.com",
  databaseURL: "https://prerequisiteapp.firebaseio.com",
  projectId: "prerequisiteapp",
  storageBucket: "prerequisiteapp.appspot.com",
  messagingSenderId: "921028901624"
};

firebase.initializeApp(config);
// firebase.firestore().settings(settings);

// const settings = {config, timestampsInSnapshots: true};
// firestore.settings(settings);

const FIREBASE = firebase;
const FIREBASE_AUTH = firebase.auth();
const FIREBASE_DATABASE = firebase.database();
const FIREBASE_STORAGE = firebase.storage();
// const FIRESTORE = firestore();


export {
  FIREBASE,
  FIREBASE_AUTH, 
  FIREBASE_DATABASE, 
  FIREBASE_STORAGE, 
  // FIRESTORE
};
