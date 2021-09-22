import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import 'firebase/compat/storage'

import { 
    getAuth,
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInAnonymously, 
    signInWithCustomToken, 
    signInWithPopup, 
    updateEmail,
    updateProfile, 
} from 'firebase/auth'

///////////////////////////////////////////////
//Modify this line to set the environment
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
export let environment = 'PRO';
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

var configPRE = {
    apiKey: "AIzaSyCUBpYspYtPSoNKjFx86Y5xHJkXp3dPcO0",
    authDomain: "nomoresheet.es",
    databaseURL: "https://nomoresheet-pre.firebaseio.com",
    projectId: "nomoresheet-pre",
    storageBucket: "nomoresheet-pre.appspot.com",
    messagingSenderId: "809572059318",
    appId: "1:809572059318:web:dcbab69066a1dddc"
};
var configPRO = {
    apiKey: "AIzaSyCI6dpu54CeFd1NOH5s7B-sHeK3KdEH5KU",
    authDomain: "nomoresheet.es",
    databaseURL: "https://nomoresheet-forum.firebaseio.com",
    projectId: "nomoresheet-forum",
    storageBucket: "nomoresheet-forum.appspot.com",
    messagingSenderId: "878815391785"
};

firebase.initializeApp(environment === 'PRE' ? configPRE : configPRO);

const googleProvider      = new GoogleAuthProvider()
const auth                = getAuth()
const storageRef          = firebase.storage().ref()
const firebaseServerValue = firebase.database.ServerValue

export { 
    auth, 
    googleProvider, 
    onAuthStateChanged, 
    signInAnonymously, 
    signInWithCustomToken, 
    signInWithPopup, 
    storageRef, 
    firebaseServerValue, 
    updateEmail,
    updateProfile, 
}
export default firebase