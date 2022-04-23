import { initializeApp } from 'firebase/app'
import {
    endAt,
    equalTo,
    get,
    getDatabase,
    goOffline,
    goOnline,
    increment,
    limitToFirst,
    limitToLast,
    onDisconnect,
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
        apiKey: "AIzaSyAU_xn3LkpnKQn_A4TXLfzrygvbrYc9Go4",
        authDomain: "mana-pre.firebaseapp.com",
        databaseURL: "https://mana-pre-default-rtdb.firebaseio.com",
        projectId: "mana-pre",
        storageBucket: "mana-pre.appspot.com",
        messagingSenderId: "55595433033",
        appId: "1:55595433033:web:12f857f9d0289254179398"
    },
    'PRO': {
        apiKey: "AIzaSyCm26Z1yejwnxzj12I-N4dB8HZmua2mkBA",
        authDomain: "xn--maa-8ma.com",
        databaseURL: "https://mana-pro-default-rtdb.firebaseio.com",
        projectId: "mana-pro",
        storageBucket: "mana-pro.appspot.com",
        messagingSenderId: "935565965192",
        appId: "1:935565965192:web:0570987d8979336e516c3d"
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
    goOffline,
    goOnline,
    increment,
    limitToFirst,
    limitToLast,
    onAuthStateChanged, 
    onDisconnect,
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