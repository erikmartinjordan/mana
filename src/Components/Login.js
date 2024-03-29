import React, { useState }                                                                                               from 'react'
import MañaLogo                                                                                                          from './MañaLogo'
import Loading                                                                                                           from './Loading'
import { auth, db, environment, googleProvider, ref, runTransaction, signInWithPopup, signInAnonymously, updateProfile } from '../Functions/Firebase'
import AnonymImg                                                                                                         from '../Functions/AnonymImg'
import AnonymName                                                                                                        from '../Functions/AnonymName'
import GoogleButton                                                                                                      from '../Assets/GoogleButton'
import AnonymButton                                                                                                      from '../Assets/AnonymButton'
import unmount                                                                                                           from '../Functions/Unmount'
import '../Styles/Login.css'

const Login = ({ hide }) => {  

    const [animation, setAnimation] = useState('')
    const [email, setEmail]         = useState('')
    const [status, setStatus]       = useState('initial')

    const logInGoogle = async () => {
        
        let { user } = await signInWithPopup(auth, googleProvider)
        
        if(user.metadata.createdAt === user.metadata.lastLoginAt){

            runTransaction(ref(db, `users/${user.uid}/name`), _ => user.displayName)
            runTransaction(ref(db, `users/${user.uid}/profilePic`), _ => user.photoURL)
            
        }
        else{
            
            checkProfilePic(user)
        }
        
        hide()
      
    }  

    const logInMagic = async (e) => {

        e.preventDefault()

        setStatus('processing')

        let url = `https://us-central1-mana-${environment.toLowerCase()}.cloudfunctions.net/sendMagicLink`

        console.log(url)
        
        let response = await fetch(url, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email: email, url: `${window.location.protocol}//${window.location.host}`})
            
        })
        
        if(response.ok){
            
            setStatus('processed')
            
        }

    }

    const logInAnonymous = async () => {

        let { user } = await signInAnonymously(auth)

        await updateProfile(user, {
            'displayName': AnonymName(),
            'photoURL': AnonymImg()
        })

        runTransaction(ref(db, `users/${user.uid}/name`), _ => user.displayName)
        runTransaction(ref(db, `users/${user.uid}/profilePic`), _ => user.photoURL)

        hide()

    }
    
    const checkProfilePic = (user) => {
        
        let firebasePhotoURL = user.photoURL
        let providerPhotoURL = user.providerData[0].photoURL
        
        if(firebasePhotoURL !== providerPhotoURL){
            
            updateProfilePic(providerPhotoURL)
            
        }
        
    }
    
    const updateProfilePic = async (photoURL) => {
        
        let user = auth.currentUser
        
        await updateProfile(user, {'photoURL': photoURL})

        runTransaction(ref(db, `users/${user.uid}/profilePic`), _ => user.photoURL)
        
        window.location.reload()
       
    }

    
    return (
        <div className = {`Login ${animation}`}>
            <div className = 'Login-wrap'>
                <div style = {{display: 'flex', justifyContent: 'center'}}><MañaLogo/></div>
                <h3>Log in</h3>
                <div className = 'Auth'>
                    <GoogleButton  logIn = {logInGoogle}/>
                    <AnonymButton  logIn = {logInAnonymous}/>
                    <hr></hr>
                    <form onSubmit = {logInMagic}>
                        <input placeholder = 'jeff.bezos@amazon.com' onChange = {(e) => setEmail(e.target.value)}></input>
                        <button disabled = {status === 'processing' || status === 'processed'}>{status === 'initial' ? 'Accede con tu correo' : status === 'processing' ? <Loading/> : '¡Correo enviado!'}</button>
                    </form>
                </div>
                <div className = 'info'>El acceso vía Google previene el uso de cuentas falsas y <em>spam</em>. Maña no publicará en tu nombre, ni te enviará <em>mails</em>, ni utilizará tus datos.</div>
            </div>
            <div className = 'Invisible' onClick = {() => unmount(setAnimation, hide)}></div>
        </div>  
    )
  
}

export default Login