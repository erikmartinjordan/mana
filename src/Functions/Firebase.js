import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

///////////////////////////////////////////////
//Modify this line to set the environment
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
export let environment = 'PRE';
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

export const fetchAdmin  = async (user) => {
    
    let idToken = await firebase.auth().currentUser.getIdToken(true);
    
    let url = environment === 'PRE' 
    ? 'https://us-central1-nomoresheet-pre.cloudfunctions.net/isAdmin' 
    : 'https://us-central1-nomoresheet-forum.cloudfunctions.net/isAdmin';
    
    let response = await fetch(url, {
        "method":  "POST",
        "headers": { "Content-Type": "application/json" },
        "body":    JSON.stringify({ "idToken": idToken })
    });
    
    if(response.ok){
        
        let json    = await response.json();
        
        var isAdmin = json.isAdmin;
        
    } 
    
    return isAdmin;
    
}
export const googleProvider      = new firebase.auth.GoogleAuthProvider();
export const auth                = firebase.auth();
export const storageRef          = firebase.storage().ref();
export const firebaseServerValue = firebase.database.ServerValue;
export default firebase;