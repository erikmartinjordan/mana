import React, { Component } from 'react';
import firebase, { auth } from './Firebase.js';
import Login from './Login.js';
import countVotesRepliesSpicy from './ReturnVotesRepliesSpicy.js'
import '../Styles/Perfil.css';


class Perfil extends Component {

  constructor(){
      super();
      this.state = {
         infoUser: null,
         render: true,
         spicy: 0,
         user: null,
         postsAdmin: 0,
         viewsAdmin: 0
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
              if(user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2'){
                  firebase.database().ref('articles/').on( 'value', (snapshot) => {

                  var object = snapshot.val();
                  var totalViews = 0; 
                  var totalPosts = Object.keys(object).length;

                  Object.keys(object).map( (key) => {
                      
                      totalViews = totalViews + object[key].views;
                      return totalViews;
                      
                  });
                  this.setState({ 
                      postsAdmin: totalPosts,
                      viewsAdmin: totalViews 
                  });    
                    
              });
              }
                            
          }
      });
      
  }
  
  showBanner = () => this.setState({ render: true }); 
  hideBanner = () => this.setState({ render: false });
    
  render() {
      
    if(this.state.user && this.state.infoUser){
        
        var nombre = this.state.user.displayName;
        var img = this.state.user.photoURL;
        var articulos = (this.state.postsAdmin + this.state.infoUser.posts.numPosts).toLocaleString();
        var respuestas = this.state.infoUser.replies.numReplies.toLocaleString();
        var visitas = (this.state.viewsAdmin + this.state.infoUser.postsViews).toLocaleString();
                
    }
       
    return (
      [<div className = 'Perfil'>
        <h2>Perfil</h2>
        <div className = 'Datos'>
            <img src = {img}></img>
            <h3>{nombre}</h3>
                <div className = 'Bloque'>
                    <div className = 'Title'>Email</div>
                    <div className = 'Num'>{this.state.user ? this.state.user.email : null}</div>
                    <div className = 'Comment'>Tu correo no se muestra ni se utiliza en ningún momento.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Visitas</div>
                    <div className = 'Num'>{visitas}</div>
                    <div className = 'Comment'>Se muestran el número de visitas totales que han recibido tus publicaciones.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Artículos</div>
                    <div className = 'Num'>{articulos}</div>
                    <div className = 'Comment'>Se muestran el número de artículos totales publicados.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Respuestas</div>
                    <div className = 'Num'>{respuestas}</div>
                    <div className = 'Comment'>Se muestran el número de respuestas que has publicado.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Picante</div>
                    <div className = 'Num'></div>
                    <div className = 'Comment'>Se muestran el número de veces que te han dado picante.</div>
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
