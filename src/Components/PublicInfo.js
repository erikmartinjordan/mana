import React, { useState, useEffect }   from 'react';
import { Link }                         from 'react-router-dom';
import TimeAgo                          from 'react-timeago';
import buildFormatter                   from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                   from 'react-timeago/lib/language-strings/es';
import firebase, {auth}                 from '../Functions/Firebase.js';
import GetName                          from '../Functions/GetName.js';
import GetProfileImg                    from '../Functions/GetProfileImg.js';
import GetNumberOfViews                 from '../Functions/GetNumberOfViews.js';
import GetLevel                         from '../Functions/GetLevelAndPointsToNextLevel.js';
import GetPoints                        from '../Functions/GetPoints.js';
import GetLastArticles                  from '../Functions/GetLastArticles.js';
import GetRankingUser                   from '../Functions/GetRankingUser.js';
import ReputationGraph                  from '../Functions/ReputationGraph.js';
import UserAvatar                       from '../Functions/UserAvatar.js';
import '../Styles/PublicInfo.css';

const formatter = buildFormatter(spanishStrings);

const PublicInfo = (props) => {
    
    const [userUid, setUserUid]                  = useState(props.match.params.string);
    const [profileViews, setProfileViews]        = useState(0);
    const [profileLastSeen, setProfileLastSeen]  = useState(null);
    const name                                   = GetName(userUid);
    const views                                  = GetNumberOfViews(userUid);
    const photoURL                               = GetProfileImg(userUid);
    const points                                 = GetPoints(userUid);
    const [level, pointsToNextLevel, percentage] = GetLevel(...points);
    const articles                               = GetLastArticles(userUid, 10); 
    const ranking                                = GetRankingUser(userUid);
    const user                                   = {uid: userUid, photoURL: photoURL};
    
    useEffect( () => {
        
        firebase.database().ref(`users/${userUid}/profileViews`).transaction( value => {
            
            setProfileViews(value ? value : 0);
            
            return value + 1;
        });
        
        firebase.database().ref(`users/${userUid}/profileLastSeen`).transaction( value => {
            
            setProfileLastSeen(value ? value : 0);
            
            return (new Date()).getTime();
        });
        
    }, []);
    
    const beautifyNumber = (number) => {
        
        let beautyPoints;
        
        if(number < 1000)                      beautyPoints = `${number}`;
        if(number >= 1000 && number < 1000000) beautyPoints = `~${(number/1000).toFixed(1)}k`;
        if(number >= 1000000)                  beautyPoints = `~${(number/1000000).toFixed(1)}m`;
        
        return beautyPoints;
        
    }
    
    return (
          <div className = 'Public-Info'>
                <div className = 'Datos'>
                    <UserAvatar user = {user}/>
                    <h2>{name}</h2>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Reputación {ranking && <span className = 'Ranking'>{ranking}</span>}</div>
                        <div className = 'Num'>{points.toLocaleString()}</div>
                        {!props.uid &&
                            <div className = 'Comment'>Puntos totales hasta el momento.</div>
                        }
                        <ReputationGraph userUid = {userUid} canvas = {props.canvas ? props.canvas : 1}/>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Impacto</div>
                        <div className = 'Num'>{beautifyNumber(views)}</div>
                        {!props.uid &&
                            <div className = 'Comment'>Número total de impresiones de publicaciones.</div>
                        }
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Visitas al perfil</div>
                        <div className = 'Num'>{profileViews}</div>
                        {!props.uid &&
                            <div className = 'Comment'>
                                {profileLastSeen 
                                ? <div>Última visita a tu perfil <TimeAgo formatter = {formatter} date = {profileLastSeen}/>.</div>
                                : 'Tu perfil no tiene visitas.'
                                }           
                            </div>
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
                            <div className = 'Title'>Últimas publicaciones</div>
                            {articles.map( (article, key) => <div key = {key}><Link to = {'/comunidad/post/' + article.url}>{article.title}</Link></div>)}
                        </div>
                    }
                </div>
            </div>
    );
}

export default PublicInfo;
