import React, { Component } from 'react';
import {auth, provider} from './Firebase.js';
import '../Styles/Login.css';

class Login extends Component {  

  login = () => {
      auth.signInWithPopup(provider).then( result => this.setState({write: true, user: result.user}) ); 
      this.props.hide();
  }  
    
  close = () => this.props.hide();
    
  render() {
    return (
        <div className = 'Login'>
            <div className = 'Login-wrap'>
                <h2>¡Hola!</h2>
                <p>Necesitas identificarte si quieres votar, publicar o responder:</p>
                <ul>
                    <li>No publicaremos en tu nombre.</li>
                    <li>No te enviaremos <em>mails</em>.</li>
                    <li>No utilizaremos tus datos.</li>
                </ul>
                <button className = 'bottom' onClick = {this.login}>Accede con
                    <span> </span>
                    <span className = 'Google-blue'>G</span>
                    <span className = 'Google-red'>o</span>
                    <span className = 'Google-yellow'>o</span>
                    <span className = 'Google-blue'>g</span>
                    <span className = 'Google-green'>l</span>
                    <span className = 'Google-red'>e</span>
                </button>
                <button className = 'more'   onClick={this.close}> Volver</button>
            </div>
        </div>  
    );
  }
}

export default Login;
