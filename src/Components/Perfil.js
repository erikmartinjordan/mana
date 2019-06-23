import React, { Component } from 'react';
import firebase, { auth } from './Firebase.js';
import Login from './Login.js';
import '../Styles/Perfil.css';

class Perfil extends Component {

  constructor(){
      super();
      this.state = {
         infoUser: null,
         render: true,
         user: null,
      }
  }
    
  componentDidMount = () => {
      
      document.title = 'Perfil – Nomoresheet'; 
      document.querySelector('meta[name="description"]').content = 'Este es tu perfil en Nomoresheet...';
      
      auth.onAuthStateChanged( user => {

          if(user){
              this.setState({ 
                  render: false,
                  user: user 
              });
              firebase.database().ref('users/' + this.state.user.uid).on( 'value', (snapshot) => {

                  var object = snapshot.val();
                  this.setState({ infoUser: object });

              });
              
          }
      });
      
  }
  
  showBanner = () => this.setState({ render: true }); 
  hideBanner = () => this.setState({ render: false });
    
  render() {
      
    if(this.state.user && this.state.infoUser){
        
        var nombre = this.state.user.displayName;
        var img = this.state.user.photoURL;
        var date = new Date(this.state.user.metadata.creationTime);
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        var creation = dd + '/' + mm + '/' + yyyy;  
        var visitas = this.state.infoUser.postsViews.toLocaleString();
        var articulos = this.state.infoUser.posts.numPosts;
        var respuestas = this.state.infoUser.replies.numReplies;
        
    }
       
    return (
      [<div className = 'Perfil'>
        <h2>Perfil</h2>
        <div className = 'Datos'>
            <img src = {img}></img>
            <h3>{nombre}</h3>
            <div className = 'Bloque'>
                <div>
                    <div className = 'Peque'>✨Visitas</div>
                    <div className = 'Gigante'>{visitas}</div>
                </div>
                <div>
                    <div className = 'Peque'>✒️ Artículos publicados</div>
                    <div className = 'Gigante'>{articulos}</div>
                </div>
                <div>
                    <div className = 'Peque'>💬 Respuestas publicadas</div>
                    <div className = 'Gigante'>{respuestas}</div>
                </div>
            </div>
        </div>
      </div>,
      <div>
        {this.state.render ? <Login hide = {this.hideBanner}></Login> : null}
      </div>]                                               
    );
  }
}

export default Perfil;
