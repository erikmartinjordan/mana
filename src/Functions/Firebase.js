import firebase from 'firebase'

  var config = {
    apiKey: "AIzaSyCI6dpu54CeFd1NOH5s7B-sHeK3KdEH5KU",
    authDomain: "nomoresheet-forum.firebaseapp.com",
    databaseURL: "https://nomoresheet-forum.firebaseio.com",
    projectId: "nomoresheet-forum",
    storageBucket: "nomoresheet-forum.appspot.com",
    messagingSenderId: "878815391785"
  };

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();
export default firebase;