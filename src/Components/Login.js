import React, { Component } from 'react';
import {auth, provider} from '../Functions/Firebase.js';
import '../Styles/Login.css';

class Login extends Component {  
    
  componentDidMount  = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );

  login = () => {
      auth.signInWithPopup(provider).then( result => this.setState({write: true, user: result.user}) ); 
      this.props.hide();
  }  
    
  close = () => this.props.hide();
    
  render() {
    return (
        <div className = 'Login'>
            <div className = 'Login-wrap'>
                <h2>¡Oh, genial!</h2>
                <p>Estás a punto de acceder a la aplicación, ahora debes iniciar sesión con una cuenta de Gmail para continuar. Podrás: </p>
                <ul>
                    <li>📌 Publicar entradas en la comunidad.</li>
                    <li>🎉 Comentar otras publicaciones.</li>
                    <li>🤖 Utilizar la <em>app</em>.</li>
                </ul>
                <button className = 'Google' onClick = {this.login}>
                    <svg width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"></path></svg>
                    <span>Accede con Google</span>
                </button>
                <div className = 'info'>El acceso vía Google previene cuentas falsas y <em>spam</em>. No publicaré en tu nombre, ni te enviaré <em>mails</em>, ni utilizaré tus datos.</div>
            </div>
            <div className = 'Invisible' onClick = {this.close}></div>
        </div>  
    );
  }
}

export default Login;
