import React                          from 'react';
import firebase, {auth, provider}     from '../Functions/Firebase';
import NomoresheetLogo                from '../Functions/NomoresheetLogo';
import '../Styles/Login.css';

const Login = ({hide}) => {  

    const loginOAuth = async () => {
        
        let { user, additionalUserInfo } = await auth.signInWithPopup(provider);
        
        if(additionalUserInfo.isNewUser){
            
            firebase.database().ref(`users/${user.uid}/name`).transaction(value => user.displayName);
            firebase.database().ref(`users/${user.uid}/profilePic`).transaction(value => user.photoURL);
            
        }
        else{
            
            checkProfilePic(user);
        }
        
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
                <p>Necesitas identificarte para continuar. Podrás publicar, comentar, votar y leer publicaciones privadas. Una vez autenticado, podrás escribir de forma anónima.</p>
                <div className = 'OAuth'>
                    <button className = 'Google' onClick = {loginOAuth}>
                        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"></path></svg>
                        <span>Accede con Google</span>
                    </button>
                </div>
                <div className = 'info'>El acceso vía Google previene el uso de cuentas falsas y <em>spam</em>. Nomoresheet no publicará en tu nombre, ni te enviará <em>mails</em>, ni utilizará tus datos.</div>
            </div>
            <div className = 'Invisible' onClick = {hide}></div>
        </div>  
    );
  
}

export default Login;
