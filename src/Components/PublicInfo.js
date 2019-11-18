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
import '../Styles/PublicInfo.css';

const formatter = buildFormatter(spanishStrings);

const PublicInfo = (props) => {
    
    const [userUid, setUserUid] = useState(false);
    const [profileViews, setProfileViews] = useState(0);
    const [profileLastSeen, setProfileLastSeen] = useState(null);
    const imgUrl = GetProfileImg(userUid);
    const name = GetName(userUid);
    const views = GetNumberOfViews(userUid);
    const points = GetPoints(userUid);
    const level = GetLevel(...points)[0];
    const pointsToNextLevel = GetLevel(...points)[1];
    const percentage = GetLevel(...points)[2];
    const articles = GetLastArticles(userUid, 10); 
    const ranking = GetRankingUser(userUid);
        
    useEffect( () => {
        
        // Component is mounted
        let mounted = true;

        // Getting UID of the user
        var uid;

        // From props or from URL
        uid = props.uid ? props.uid : props.match.params.string;

        // Setting state
        if(mounted) setUserUid(uid);
        
        // Unmounting
        return () => {mounted = false};

    });
    
    useEffect( () => {
        
        // Component is mounted
        let mounted = true;
        
        if(userUid){
            
            // Adding profile visits to database
            firebase.database().ref('users/' + userUid + '/profileViews' ).transaction( value => {
                
                // Setting profile views as state
                if(mounted) setProfileViews(value ? value : 0);
                
                // If we are opening the profile of the user in a new URL 
                // Then, we need to increment the number of visits by 1
                // Otherwise, we don't modify the value
                return props.uid ? value : value + 1;
            });
            
            // Adding date last visit to profile
            firebase.database().ref('users/' + userUid + '/profileLastSeen').transaction( value => {
                
                // Setting last date as state
                if(mounted) setProfileLastSeen(value ? value : 0);
                
                // If we are opening the profile of the user in a new URL 
                // Then, we need to update the date of last seen
                // Otherwise, we don't modify the value
                return props.uid ? value : (new Date()).getTime();
            });
            
        }
        
        // Unmounted component
        return () => mounted = false;
        
    }, [userUid]);
        
    return (
          <div className = 'Public-Info'>
                <div className = 'Datos'>
                    <div className = {'Progress ProgressBar-' + percentage}>
                        <img src = {imgUrl}></img>
                    </div>
                    <h2>{name}</h2>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Puntos {ranking && <span className = 'Ranking'>{ranking}</span>}</div>
                        <ReputationGraph userUid = {userUid}/>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Impacto</div>
                        <div className = 'Num'>{views.toLocaleString()}</div>
                        {!props.uid &&
                            <div className = 'Comment'>Se muestran el número total de impresiones que han recibido tus publicaciones.</div>
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
