import firebase from 'firebase'

var configPRE = {
    apiKey: "AIzaSyCUBpYspYtPSoNKjFx86Y5xHJkXp3dPcO0",
    authDomain: "nomoresheet-pre.firebaseapp.com",
    databaseURL: "https://nomoresheet-pre.firebaseio.com",
    projectId: "nomoresheet-pre",
    storageBucket: "nomoresheet-pre.appspot.com",
    messagingSenderId: "809572059318",
    appId: "1:809572059318:web:dcbab69066a1dddc"
}

  var configPRO = {
    apiKey: "AIzaSyCI6dpu54CeFd1NOH5s7B-sHeK3KdEH5KU",
    authDomain: "nomoresheet-forum.firebaseapp.com",
    databaseURL: "https://nomoresheet-forum.firebaseio.com",
    projectId: "nomoresheet-forum",
    storageBucket: "nomoresheet-forum.appspot.com",
    messagingSenderId: "878815391785"
  };

firebase.initializeApp(configPRO);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();
export default firebase;