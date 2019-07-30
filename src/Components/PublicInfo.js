import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import { Link }    from 'react-router-dom';
import GetNumberOfPosts from '../Functions/GetNumberOfPosts.js';
import GetNumberOfReplies from '../Functions/GetNumberOfReplies.js';
import GetName from '../Functions/GetName.js';
import GetProfileImg from '../Functions/GetProfileImg.js';
import GetNumberOfViews from '../Functions/GetNumberOfViews.js';
import GetNumberOfSpicy from '../Functions/GetNumberOfSpicy.js';
import GetLevel from '../Functions/GetLevelAndPointsToNextLevel.js';
import GetPoints from '../Functions/GetPoints.js';
import GetLastArticles from '../Functions/GetLastArticles.js';
import '../Styles/PublicInfo.css';


const PublicInfo = (props) => {
    
  const [userUid, setUserUid] = useState(false);
  const imgUrl = GetProfileImg(userUid);
  const name = GetName(userUid);
  const posts = GetNumberOfPosts(userUid);
  const replies = GetNumberOfReplies(userUid);
  const spicy = GetNumberOfSpicy(userUid);
  const views = GetNumberOfViews(userUid);
  const points = GetPoints(posts, replies, spicy)[0];
  const level = GetLevel(points)[0];
  const pointsToNextLevel = GetLevel(points)[1];
  const percentage = GetLevel(points)[2];
  const articles = GetLastArticles(userUid, 10);  
    
  useEffect( () => {
      
      // Getting UID of the user
      var uid;
      
      // From props or from URL
      uid = props.uid ? props.uid : props.match.params.string;
      
      // Setting state
      setUserUid(uid);
  
  });
                                                                    
  return (
          <div className = 'Public-Info'>
                <div className = 'Datos'>
                    <div className = {'Progress ProgressBar-' + percentage}>
                        <img src = {imgUrl}></img>
                    </div>
                    <h2>{name}</h2>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Impacto</div>
                        <div className = 'Num'>{views.toLocaleString()}</div>
                        {!props.uid &&
                            <div className = 'Comment'>Se muestran el número total de visitas que han recibido los artículos publicados.</div>
                        }
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Puntos</div>
                        <div className = 'Num'>{points.toLocaleString()}</div>
                        {!props.uid &&
                            <div className = 'Comment'>Se muestran el número de puntos totales conseguidos hasta el momento.</div>
                        }
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Nivel</div>
                        <div className = 'Num'>{level}</div>
                        <div className = 'Bar'>
                            <div className = 'Completed' style = {{width: percentage + '%'}}></div>
                        </div>
                        <div className = 'Comment'>{pointsToNextLevel} puntos para el siguiente nivel ({percentage}% completado).</div>
                    </div>
                    {!props.uid &&
                        <div className = 'Last-Articles'>
                            <div className = 'Title'>Últimos artículos</div>
                            {articles.map(article => <div><Link to = {'/comunidad/post/' + article.url}>{article.title}</Link></div>)}
                        </div>
                    }
                </div>
            </div>
  );
}

export default PublicInfo;
