import React, { Component } from 'react';
import {auth, provider} from './Firebase.js';
import '../Styles/Login.css';

class Login extends Component {  
    
  componentDidMount  = () => window.twemoji.parse(document.getElementById('root'));
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'));

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
                <div className = 'info'>No publicaré en tu nombre, ni te enviaré <em>mails</em>, ni utilizaré tus datos.</div>
            </div>
        </div>  
    );
  }
}

export default Login;
