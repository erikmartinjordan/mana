import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import { 
    getDownloadURL,
    getStorage, 
    ref,
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

firebase.initializeApp(config[environment])

const googleProvider      = new GoogleAuthProvider()
const auth                = getAuth()
const storage             = getStorage()
const firebaseServerValue = firebase.database.ServerValue

export { 
    auth, 
    environment,
    getDownloadURL,
    googleProvider, 
    onAuthStateChanged, 
    ref,
    signInAnonymously, 
    signInWithCustomToken, 
    signInWithPopup, 
    storage, 
    firebaseServerValue, 
    updateEmail,
    updateProfile,
    uploadBytesResumable
}
export default firebase