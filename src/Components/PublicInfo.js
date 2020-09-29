import React                                     from 'react';
import { Link }                                  from 'react-router-dom';
import TimeAgo                                   from 'react-timeago';
import buildFormatter                            from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                            from 'react-timeago/lib/language-strings/es';
import Donate                                    from './Donate';
import UserAvatar                                from './UserAvatar';
import GetName                                   from '../Functions/GetName';
import GetProfileImg                             from '../Functions/GetProfileImg';
import GetNumberOfViews                          from '../Functions/GetNumberOfViews';
import GetLevel                                  from '../Functions/GetLevelAndPointsToNextLevel';
import GetPoints                                 from '../Functions/GetPoints';
import GetLastArticles                           from '../Functions/GetLastArticles';
import GetRankingUser                            from '../Functions/GetRankingUser';
import GetNumberOfProfileViewsAndProfileLastSeen from '../Functions/GetNumberOfProfileViewsAndProfileLastSeen';
import GetStripeUserId                           from '../Functions/GetStripeUserId';
import ReputationGraph                           from '../Functions/ReputationGraph';
import '../Styles/PublicInfo.css';

const formatter = buildFormatter(spanishStrings);

const PublicInfo = (props) => {
    
    const userUid                                = props.match.params.string;
    const [profileViews, profileLastSeen]        = GetNumberOfProfileViewsAndProfileLastSeen(userUid);
    const name                                   = GetName(userUid);
    const views                                  = GetNumberOfViews(userUid);
    const photoURL                               = GetProfileImg(userUid);
    const points                                 = GetPoints(userUid);
    const [level, pointsToNextLevel, percentage] = GetLevel(...points);
    const articles                               = GetLastArticles(userUid, 10); 
    const ranking                                = GetRankingUser(userUid);
    const stripeUserId                           = GetStripeUserId(userUid);
    const user                                   = {uid: userUid, photoURL: photoURL};
    
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
                    {stripeUserId ? <Donate name = {name} stripeUserId = {stripeUserId}/> : null}
                    <UserAvatar user = {user}/>
                    <h2>{name}</h2>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Reputación {ranking && <span className = 'Ranking'>{ranking}</span>}</div>
                        <div className = 'Num'>{points.toLocaleString()}</div>
                        <div className = 'Comment'>Puntos totales hasta el momento.</div>
                        <ReputationGraph userUid = {userUid} canvas = {1}/>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Impacto</div>
                        <div className = 'Num'>{beautifyNumber(views)}</div>
                        <div className = 'Comment'>Número total de impresiones de publicaciones.</div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Visitas al perfil</div>
                        <div className = 'Num'>{profileViews}</div>
                        <div className = 'Comment'>
                            {profileLastSeen 
                            ? <div>Última visita a tu perfil <TimeAgo formatter = {formatter} date = {profileLastSeen}/>.</div>
                            : 'Tu perfil no tiene visitas.'
                            }           
                        </div>
                    </div>
                    <div className = 'Bloque'>
                        <div className = 'Title'>Nivel</div>
                        <div className = 'Num'>{level}</div>
                        <div className = 'Bar'>
                            <div className = 'Completed' style = {{width: percentage + '%'}}></div>
                        </div>
                        <div className = 'Comment'>{pointsToNextLevel} puntos para el siguiente nivel ({percentage}% completado).</div>
                    </div>
                    <div className = 'Last-Articles'>
                        <div className = 'Title'>Últimas publicaciones</div>
                        {articles.map( (article, key) => <div key = {key}><Link to = {'/comunidad/post/' + article.url}>{article.title}</Link></div>)}
                    </div>
                </div>
            </div>
    );
}

export default PublicInfo;