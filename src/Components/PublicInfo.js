import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import GetNumberOfPosts from '../Functions/GetNumberOfPosts.js';
import GetNumberOfReplies from '../Functions/GetNumberOfReplies.js';
import GetName from '../Functions/GetName.js';
import GetProfileImg from '../Functions/GetProfileImg.js';
import GetNumberOfViews from '../Functions/GetNumberOfViews.js';
import Default from './Default';
import '../Styles/PublicInfo.css';


const PublicInfo = (props) => {
    
  const userUid = props.match.params.string;
  const imgUrl = GetProfileImg(props.match.params.string);
  const name = GetName(props.match.params.string);
  const posts = GetNumberOfPosts(props.match.params.string);
  const replies = GetNumberOfReplies(props.match.params.string);
  const views = GetNumberOfViews(props.match.params.string);
        
  useEffect( () => {
    

  }, []);
      
                                                                
  return (
      <React.Fragment>
          { userUid 
          ? <div className = 'Public-Info'>
                <div className = 'Datos'>
                    <img src = {imgUrl}></img>
                    <h2>{name}</h2>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Artículos</div>
                        <div className = 'Num'>{posts}</div>
                        <div className = 'Comment'>Se muestran el número total de artículos publicados.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Respuestas</div>
                        <div className = 'Num'>{replies}</div>
                        <div className = 'Comment'>Se muestran el número total de respuestas publicadas.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Visitas</div>
                        <div className = 'Num'>{views.toLocaleString()}</div>
                        <div className = 'Comment'>Se muestran el número total de visitas que han recibido los artículos publicados.</div>
                    </div>
                </div>
            </div>
          : <Default></Default>
          }
      </React.Fragment>
  );
}

export default PublicInfo;
