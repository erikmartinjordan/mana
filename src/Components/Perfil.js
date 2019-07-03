import React, { Component } from 'react';
import firebase, { auth } from './Firebase.js';
import Login from './Login.js';
import usePostsRepliesSpicy from './ReturnPostsRepliesSpicy.js';
import returnPoints from './ReturnPointsAndValues.js';
import '../Styles/Perfil.css';

const PostsRepliesSpicyPoints = (props) => {
    
    var posts, valuePost, replies, valueReply, spicy, valueSpicy, points, a, b;
        
    a = usePostsRepliesSpicy(); 
    
    posts   = a[0].toLocaleString();
    replies = a[1].toLocaleString();
    spicy   = a[2].toLocaleString();
    
    b = returnPoints(posts, replies, spicy);
    
    points     = b[0].toLocaleString();
    valuePost  = b[1].toLocaleString();
    valueReply = b[2].toLocaleString();
    valueSpicy = b[3].toLocaleString();
        
    switch(props.variable){
        case 'posts':       return posts; break;
        case 'replies':     return replies; break;
        case 'spicy':       return spicy; break;
        case 'points':      return points; break;
        case 'valuePost':   return valuePost; break;
        case 'valueReply':  return valueReply; break;
        case 'valueSpicy':  return valueSpicy; break;
        default:            return null; break;
    }
}

class Perfil extends Component {

  constructor(){
      super();
      this.state = {
         infoUser: null,
         render: true,
         spicy: 0,
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
        var articulos = this.state.infoUser.posts.numPosts.toLocaleString();
        var respuestas = this.state.infoUser.replies.numReplies.toLocaleString();
        var visitas = this.state.infoUser.postsViews.toLocaleString();
                
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
                    <div className = 'Comment'>Se muestran el número de artículos totales publicados. Publicando un artículo, sumas <PostsRepliesSpicyPoints variable = 'valuePost'></PostsRepliesSpicyPoints> puntos.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Respuestas</div>
                    <div className = 'Num'>{respuestas}</div>
                    <div className = 'Comment'>Se muestran el número de respuestas que has publicado.Por cada respuesta, sumas <PostsRepliesSpicyPoints variable = 'valueReply'></PostsRepliesSpicyPoints> puntos.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Picante</div>
                    <div className = 'Num'><PostsRepliesSpicyPoints variable = 'spicy'></PostsRepliesSpicyPoints></div>
                    <div className = 'Comment'>Se muestran el número de veces que te han dado picante. Por cada voto de picante, sumas <PostsRepliesSpicyPoints variable = 'valueSpicy'></PostsRepliesSpicyPoints> puntos.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Puntos</div>
                    <div className = 'Num'><PostsRepliesSpicyPoints variable = 'points'></PostsRepliesSpicyPoints></div>
                    <div className = 'Comment'></div>
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
