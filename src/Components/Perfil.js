import React, { Component } from 'react';
import firebase, { auth } from './Firebase.js';
import Login from './Login.js';
import usePostsRepliesSpicy from './ReturnPostsRepliesSpicy.js';
import returnPoints from './ReturnPointsAndValues.js';
import returnLevel from './ReturnLevelAndPointsToNextLevel.js'
import '../Styles/Perfil.css';

const PostsRepliesSpicyPointsLevel = (props) => {
    
    var posts, valuePost, replies, valueReply, spicy, valueSpicy, points, level, pointsToNextLevel, percentage, a, b, c;
        
    a = usePostsRepliesSpicy(); 
    
    posts   = a[0];
    replies = a[1];
    spicy   = a[2];
    
    b = returnPoints(posts, replies, spicy);
    
    points     = b[0];
    valuePost  = b[1];
    valueReply = b[2];
    valueSpicy = b[3];
    
    c = returnLevel(points);
    
    level             = c[0];
    pointsToNextLevel = c[1];
    percentage        = c[2];
    
    const divStyle = {
        width: `${percentage}%` 
    }
        
    switch(props.variable){
        case 'posts':               return posts.toLocaleString(); break;
        case 'replies':             return replies.toLocaleString(); break;
        case 'spicy':               return spicy.toLocaleString(); break;
        case 'points':              return points.toLocaleString(); break;
        case 'valuePost':           return valuePost.toLocaleString(); break;
        case 'valueReply':          return valueReply.toLocaleString(); break;
        case 'valueSpicy':          return valueSpicy.toLocaleString(); break;
        case 'level':               return level.toLocaleString(); break;
        case 'pointsToNextLevel':   return pointsToNextLevel.toLocaleString(); break;
        case 'percentage':          return percentage.toLocaleString(); break;
        case 'percetageBar':        return <div className = 'Completed' style = {divStyle}></div>; break;
        default:                    return null; break;
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
                    <div className = 'Num'><PostsRepliesSpicyPointsLevel variable = 'posts'></PostsRepliesSpicyPointsLevel></div>
                    <div className = 'Comment'>Se muestran el número de artículos totales publicados. Publicando un artículo, sumas <PostsRepliesSpicyPointsLevel variable = 'valuePost'></PostsRepliesSpicyPointsLevel> puntos.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Respuestas</div>
                    <div className = 'Num'><PostsRepliesSpicyPointsLevel variable = 'replies'></PostsRepliesSpicyPointsLevel></div>
                    <div className = 'Comment'>Se muestran el número de respuestas que has publicado. Por cada respuesta, sumas <PostsRepliesSpicyPointsLevel variable = 'valueReply'></PostsRepliesSpicyPointsLevel> puntos.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Picante</div>
                    <div className = 'Num'><PostsRepliesSpicyPointsLevel variable = 'spicy'></PostsRepliesSpicyPointsLevel></div>
                    <div className = 'Comment'>Se muestran el número de veces que te han dado picante. Por cada voto de picante, sumas <PostsRepliesSpicyPointsLevel variable = 'valueSpicy'></PostsRepliesSpicyPointsLevel> puntos.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Puntos</div>
                    <div className = 'Num'><PostsRepliesSpicyPointsLevel variable = 'points'></PostsRepliesSpicyPointsLevel></div>
                    <div className = 'Comment'>Se muestran el número de puntos totales conseguidos hasta el momento.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Nivel</div>
                    <div className = 'Num'><PostsRepliesSpicyPointsLevel variable = 'level'></PostsRepliesSpicyPointsLevel></div>
                    <div className = 'Bar'>
                        <PostsRepliesSpicyPointsLevel variable = 'percetageBar'></PostsRepliesSpicyPointsLevel>
                    </div>
                    <div className = 'Comment'><PostsRepliesSpicyPointsLevel variable = 'pointsToNextLevel'></PostsRepliesSpicyPointsLevel> puntos para el siguiente nivel (<PostsRepliesSpicyPointsLevel variable = 'percentage'></PostsRepliesSpicyPointsLevel>% completado).</div>
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
