import { initializeApp } from 'firebase/app'
import {
    endAt,
    equalTo,
    get,
    getDatabase,
    increment,
    limitToFirst,
    limitToLast,
    onValue,
    orderByChild,
    orderByKey,
    ref,
    set,
    push,
    remove,
    runTransaction,
    startAt,
    update,
    query
} from 'firebase/database'
import { 
    getDownloadURL,
    getStorage, 
    ref as storageRef,
    uploadBytesResumable
} from 'firebase/storage'
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

let environment = location.hostname === 'localhost' ? 'PRE' : 'PRO'

let config = {

    'PRE': {
        apiKey: "AIzaSyCUBpYspYtPSoNKjFx86Y5xHJkXp3dPcO0",
        authDomain: "nomoresheet.es",
        databaseURL: "https://nomoresheet-pre.firebaseio.com",
        projectId: "nomoresheet-pre",
        storageBucket: "nomoresheet-pre.appspot.com",
        messagingSenderId: "809572059318",
        appId: "1:809572059318:web:dcbab69066a1dddc"
    },
    'PRO': {
        apiKey: "AIzaSyCI6dpu54CeFd1NOH5s7B-sHeK3KdEH5KU",
        authDomain: "nomoresheet.es",
        databaseURL: "https://nomoresheet-forum.firebaseio.com",
        projectId: "nomoresheet-forum",
        storageBucket: "nomoresheet-forum.appspot.com",
        messagingSenderId: "878815391785"
    }

}

initializeApp(config[environment])

const googleProvider      = new GoogleAuthProvider()
const auth                = getAuth()
const storage             = getStorage()
const db                  = getDatabase()

export { 
    auth, 
    db,
    endAt,
    environment,
    equalTo,
    get,
    getDownloadURL,
    googleProvider, 
    increment,
    limitToFirst,
    limitToLast,
    onAuthStateChanged, 
    onValue,
    orderByChild,
    orderByKey,
    ref,
    push,
    query,
    remove,
    runTransaction,
    set,
    signInAnonymously, 
    signInWithCustomToken, 
    signInWithPopup, 
    storage, 
    startAt,
    storageRef,
    update,
    updateEmail,
    updateProfile,
    uploadBytesResumable
}