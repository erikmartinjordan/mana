import React, { useState }               from 'react';
import NomoresheetLogo                   from './NomoresheetLogo';
import Loading                           from './Loading';
import firebase, { auth, environment }   from '../Functions/Firebase';
import { googleProvider }                from '../Functions/Firebase';
import AnonymImg                         from '../Functions/AnonymImg';
import AnonymName                        from '../Functions/AnonymName';
import GoogleButton                      from '../Assets/GoogleButton';
import AnonymButton                      from '../Assets/AnonymButton';
import '../Styles/Login.css';

const Login = ({hide}) => {  

    const [alert, setAlert]   = useState(null);
    const [email, setEmail]   = useState('');
    const [status, setStatus] = useState('initial');

    const logInGoogle = async () => {
        
        let { user, additionalUserInfo } = await auth.signInWithPopup(googleProvider);
        
        if(additionalUserInfo.isNewUser){
            
            firebase.database().ref(`users/${user.uid}/name`).transaction(value => user.displayName);
            firebase.database().ref(`users/${user.uid}/profilePic`).transaction(value => user.photoURL);
            
        }
        else{
            
            checkProfilePic(user);
        }
        
        hide();
      
    }  

    const logInMagic = async (e) => {

        e.preventDefault();

        setStatus('processing');
        
        let url = environment === 'PRE' 
        ? 'https://us-central1-nomoresheet-pre.cloudfunctions.net/sendMagicLink' 
        : 'https://us-central1-nomoresheet-forum.cloudfunctions.net/sendMagicLink';
        
        let response = await fetch(url, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email: email, url: `${window.location.protocol}//${window.location.host}`})
            
        });
        
        if(response.ok){
            
            setStatus('processed');
            
        }

    }

    const logInAnonymous = async () => {

        let { user, additionalUserInfo } = await auth.signInAnonymously();

        await user.updateProfile({
            'displayName': AnonymName(),
            'photoURL': AnonymImg()
        });

        firebase.database().ref(`users/${user.uid}/name`).transaction(value => user.displayName);
        firebase.database().ref(`users/${user.uid}/profilePic`).transaction(value => user.photoURL);

        hide();

    }
    
    const checkProfilePic = (user) => {
        
        let firebasePhotoURL = user.photoURL;
        let providerPhotoURL = user.providerData[0].photoURL;
        
        if(firebasePhotoURL !== providerPhotoURL){
            
            updateProfilePic(providerPhotoURL);
            
        }
        
    }
    
    const updateProfilePic = async (photoURL) => {
        
        let user = auth.currentUser;
        
        await user.updateProfile({'photoURL': photoURL});
        
        firebase.database().ref(`users/${user.uid}/profilePic`).transaction(value => user.photoURL);
        
        window.location.reload();
       
    }
    
    return (
        <div className = 'Login'>
            <div className = 'Login-wrap'>
                <div style = {{display: 'flex', justifyContent: 'center'}}><NomoresheetLogo/></div>
                <h3>Log in</h3>
                <p>Necesitas hacer <em>log in</em> para continuar. Podrás publicar, comentar, votar y leer publicaciones privadas.</p>
                <div className = 'Auth'>
                    <GoogleButton  logIn = {logInGoogle}/>
                    <AnonymButton  logIn = {logInAnonymous}/>
                    <hr></hr>
                    <form onSubmit = {logInMagic}>
                        <input placeholder = 'jeff.bezos@amazon.com' onChange = {(e) => setEmail(e.target.value)}></input>
                        <button disabled = {status === 'processing' || status === 'processed'}>{status === 'initial' ? 'Accede con tu correo' : status === 'processing' ? <Loading/> : '¡Correo enviado!'}</button>
                    </form>
                </div>
                <div className = 'info'>El acceso vía Google previene el uso de cuentas falsas y <em>spam</em>. Nomoresheet no publicará en tu nombre, ni te enviará <em>mails</em>, ni utilizará tus datos.</div>
            </div>
            <div className = 'Invisible' onClick = {hide}></div>
        </div>  
    );
  
}

export default Login;
