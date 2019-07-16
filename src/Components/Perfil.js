import React, { Component } from 'react';
import firebase, { auth } from '../Functions/Firebase.js';
import Login from './Login.js';
import usePostsRepliesSpicy from '../Functions/ReturnPostsRepliesSpicy.js';
import returnPoints from '../Functions/ReturnPointsAndValues.js';
import returnLevel from '../Functions/ReturnLevelAndPointsToNextLevel.js';
import ToggleButton from '../Functions/ToggleButton.js';
import AnonymImg from '../Functions/AnonymImg.js';
import '../Styles/Perfil.css';
import '../Styles/Progressbar.css';
import '../Styles/ToggleButton.css';

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
    
    const progressclass = `Progress ProgressBar-${percentage}`;
        
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
        case 'percentageCircle':    return <div className = {progressclass}>{props.children}</div>; break;
        default:                    return null; break;
    }
}

class Perfil extends Component {

  state = {
      infoUser: null,
      render: true,
      spicy: 0,
      user: null
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
  
  anonimizar = () => {
      
        firebase.database().ref('users/' + this.state.user.uid + '/anonimo/').transaction( (value) =>  {
            
            var res; 
            
            // Necesitamos anonimizar el nombre
            if(value === null || value === false)
                firebase.database().ref('users/' + this.state.user.uid + '/nickName/').transaction( (value) => {
                    return Math.random().toString(36).substr(2, 5);
                });
            
            // Devolvemos el resultado
            return res = value === null ? true : !value; 
        
        });
  }
  
  showBanner = () => this.setState({ render: true }); 
  hideBanner = () => this.setState({ render: false });
    
  render() {
      
    if(this.state.user && this.state.infoUser){
        
        var nombre  = this.state.infoUser.anonimo ? this.state.infoUser.nickName : this.state.user.displayName;
        var img     = this.state.infoUser.anonimo ? AnonymImg() : this.state.user.photoURL;
        var toggle  = this.state.infoUser.anonimo;
                
    }
       
    return (
      [<div className = 'Perfil'>
        <h2>Perfil</h2>
        <div className = 'Datos'>
            <PostsRepliesSpicyPointsLevel variable = 'percentageCircle'>
                    <img src = {img}></img>
            </PostsRepliesSpicyPointsLevel>
            <h3>{nombre}</h3>
                <div className = 'Bloque'>
                    <div className = 'Title'>Nombre</div>
                    <div className = 'Num'>{nombre}</div>
                    <div className = 'Comment'>Nombre que se muestra públicamente.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Anonimizar</div>
                    <div className = 'Toggle' onClick = {this.anonimizar}>
                        <div className = 'Tag'>Tu nombre real no se mostrará.</div>
                        { toggle 
                        ? <ToggleButton status = 'on' /> 
                        : <ToggleButton status = 'off' />
                        }
                    </div>
                    <div className = 'Comment'>Se mostrará un alias y foto genérica.</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Email</div>
                    <div className = 'Num'>{this.state.user ? this.state.user.email : null}</div>
                    <div className = 'Comment'>Tu correo no se muestra ni se utiliza en ningún momento.</div>
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
