import React                                     from 'react';
import { Link }                                  from 'react-router-dom';
import moment                                    from 'moment';
import Donate                                    from './Donate';
import UserAvatar                                from './UserAvatar';
import ReputationGraph                           from './ReputationGraph';
import firebase                                  from '../Functions/Firebase';
import GetName                                   from '../Functions/GetName';
import GetProfileImg                             from '../Functions/GetProfileImg';
import GetBackgroundImg                          from '../Functions/GetBackgroundImg';
import GetNumberOfViews                          from '../Functions/GetNumberOfViews';
import GetLevel                                  from '../Functions/GetLevelAndPointsToNextLevel';
import GetPoints                                 from '../Functions/GetPoints';
import GetLastArticles                           from '../Functions/GetLastArticles';
import GetRankingUser                            from '../Functions/GetRankingUser';
import GetNumberOfProfileViewsAndProfileLastSeen from '../Functions/GetNumberOfProfileViewsAndProfileLastSeen';
import GetStripeUserId                           from '../Functions/GetStripeUserId';
import beautifyNumber                            from '../Functions/BeautifyNumber';
import '../Styles/PublicInfo.css';

const PublicInfo = (props) => {
    
    const uid                                    = props.match.params.string;
    const [profileViews, profileLastSeen]        = GetNumberOfProfileViewsAndProfileLastSeen(uid);
    const name                                   = GetName(uid);
    const views                                  = GetNumberOfViews(uid);
    const backgroundURL                          = GetBackgroundImg(uid);
    const photoURL                               = GetProfileImg(uid);
    const points                                 = GetPoints(uid);
    const [level, pointsToNextLevel, percentage] = GetLevel(points);
    const articles                               = GetLastArticles(uid, 10); 
    const ranking                                = GetRankingUser(uid);
    const stripeUserId                           = GetStripeUserId(uid);
    const user                                   = {uid: uid, photoURL: photoURL};
    
    return (
        <div className = 'Public-Info'>
            <div className = 'Datos'>
                <div className = 'Header' style = {{backgroundImage: `url('${backgroundURL}')`}}>
                    {stripeUserId ? <Donate name = {name} stripeUserId = {stripeUserId}/> : null}
                    <UserAvatar user = {user}/>
                    <h2>{name}</h2>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Reputación {ranking && <span className = 'Ranking'>{ranking}</span>}</div>
                    <div className = 'Num'>{points.toLocaleString()}</div>
                    <div className = 'Comment'>Puntos totales hasta el momento</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Gráfico de reputación</div>
                    <ReputationGraph uid = {uid}/>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Impacto</div>
                    <div className = 'Num'>{beautifyNumber(views)}</div>
                    <div className = 'Comment'>Número total de impresiones de publicaciones</div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Visitas al perfil</div>
                    <div className = 'Num'>{profileViews}</div>
                    <div className = 'Comment'>
                        { profileLastSeen 
                        ? <div>Última visita al perfil {moment(profileLastSeen).fromNow()}</div>
                        : 'Tu perfil no tiene visitas'
                        }           
                    </div>
                </div>
                <div className = 'Bloque'>
                    <div className = 'Title'>Nivel</div>
                    <div className = 'Num'>{level}</div>
                    <div className = 'Bar'>
                        <div className = 'Completed' style = {{width: percentage + '%'}}></div>
                    </div>
                    <div className = 'Comment'>{pointsToNextLevel} puntos para el siguiente nivel ({percentage}% completado)</div>
                </div>
                <div className = 'Last-Articles'>
                    { articles.length > 0
                    ? <div className = 'Title'>Últimas publicaciones</div>
                    : null
                    }
                    {articles.map((article, key) => <div key = {key}><Link to = {'/comunidad/post/' + article.url}>{article.title}</Link></div>)}
                </div>
            </div>
        </div>
    );
}

export default PublicInfo;