import React, { useState, useEffect } from 'react';
import firebase, { auth } from '../Functions/Firebase.js';
import Login from './Login.js';
import GetNumberOfPosts from '../Functions/GetNumberOfPosts.js';
import GetNumberOfReplies from '../Functions/GetNumberOfReplies.js';
import GetNumberOfSpicy from '../Functions/GetNumberOfSpicy.js';
import GetPoints from '../Functions/GetPoints.js';
import GetLevel from '../Functions/GetLevelAndPointsToNextLevel.js';
import ToggleButton from '../Functions/ToggleButton.js';
import AnonymImg from '../Functions/AnonymImg.js';
import DeleteAccount from '../Functions/DeleteAccount.js'
import '../Styles/Perfil.css';
import '../Styles/Progressbar.css';
import '../Styles/ToggleButton.css';

const Perfil = () => {

  const [infoUser, setInfoUser] = useState(null);
  const [render, setRender] = useState(true);
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const posts = GetNumberOfPosts(uid);
  const replies = GetNumberOfReplies(uid);
  const spicy = GetNumberOfSpicy(uid);
  const points = GetPoints(posts, replies, spicy)[0];
  const valuePost = GetPoints(posts, replies, spicy)[1];
  const valueReply = GetPoints(posts, replies, spicy)[2];
  const valueSpicy = GetPoints(posts, replies, spicy)[3];
  const level = GetLevel(points)[0];
  const pointsToNextLevel = GetLevel(points)[1];
  const percentage = GetLevel(points)[2];
        
  useEffect( () => {
      
      document.title = 'Perfil – Nomoresheet'; 
      document.querySelector('meta[name="description"]').content = 'Este es tu perfil en Nomoresheet...';
      
      auth.onAuthStateChanged( user => {

          if(user){
              
              firebase.database().ref('users/' + user.uid).on( 'value', (snapshot) => {

                  setInfoUser(snapshot.val());

              });    
              
              setRender(false);
              setUser(user);
              setUid(user.uid);
          }
      });
      
  }, []);
  
  const anonimizar = () => {
      
        firebase.database().ref('users/' + user.uid + '/anonimo/').transaction( (value) =>  {
                        
            // Necesitamos anonimizar el nombre y el avatar
            if(value === null || value === false){
                firebase.database().ref('users/' + user.uid + '/nickName/').transaction( (value) => {
                    return Math.random().toString(36).substr(2, 5);
                });
                firebase.database().ref('users/' + user.uid + '/avatar/').transaction( (value) => {
                    return AnonymImg();
                });
            }
            
            // Devolvemos el resultado
            return value === null ? true : !value; 
        
        });
  }
       
  return (
      <React.Fragment>
          <div className = 'Perfil'>
            <h2>Perfil</h2>
            <div className = 'Datos'>
                <div className = {'Progress ProgressBar-' + percentage}>
                    {user && infoUser && infoUser.anonimo  && <img src = {infoUser.avatar}></img>}
                    {user && infoUser && !infoUser.anonimo && <img src = {user.photoURL}></img>}
                </div>
                <h3>
                    {user && infoUser && infoUser.anonimo && infoUser.nickName}
                    {user && infoUser && !infoUser.anonimo && user.displayName}
                </h3>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Nombre</div>
                        <div className = 'Num'>
                            {user && infoUser && infoUser.anonimo  && infoUser.nickName}
                            {user && infoUser && !infoUser.anonimo && user.displayName}
                        </div>
                        <div className = 'Comment'>Nombre que se muestra públicamente.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Anonimizar</div>
                        <div className = 'Toggle' onClick = {() => anonimizar()}>
                            <div className = 'Tag'>Tu nombre real no se mostrará.</div>
                            { infoUser && infoUser.anonimo 
                            ? <ToggleButton status = 'on' /> 
                            : <ToggleButton status = 'off' />
                            }
                        </div>
                        <div className = 'Comment'>Se mostrará un alias y foto genérica.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Email</div>
                        <div className = 'Num'>{user && user.email}</div>
                        <div className = 'Comment'>Tu correo no se muestra ni se utiliza en ningún momento.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Artículos</div>
                        <div className = 'Num'>{posts}</div>
                        <div className = 'Comment'>Se muestran el número de artículos totales publicados. Publicando un artículo, sumas {valuePost} puntos.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Respuestas</div>
                        <div className = 'Num'>{replies}</div>
                        <div className = 'Comment'>Se muestran el número de respuestas que has publicado. Por cada respuesta, sumas {valueReply} puntos.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Picante</div>
                        <div className = 'Num'>{spicy}🌶️</div>
                        <div className = 'Comment'>Se muestran el número de veces que te han dado picante. Por cada voto de picante, sumas {valueSpicy} puntos.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Puntos</div>
                        <div className = 'Num'>{points.toLocaleString()}</div>
                        <div className = 'Comment'>Se muestran el número de puntos totales conseguidos hasta el momento.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Nivel</div>
                        <div className = 'Num'>{level}</div>
                        <div className = 'Bar'>
                            <div className = 'Completed' style = {{width: percentage + '%'}}></div>
                        </div>
                        <div className = 'Comment'>{pointsToNextLevel} puntos para el siguiente nivel ({percentage}% completado).</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Zona de peligro</div>
                        <DeleteAccount></DeleteAccount>
                    </div>
            </div>
          </div>
        <div>
            {render && <Login hide = {() => setRender(false)}></Login>}
        </div>
    </React.Fragment>
    );
}

export default Perfil;
