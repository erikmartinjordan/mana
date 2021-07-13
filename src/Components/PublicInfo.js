import React, { useState }                       from 'react';
import { Link }                                  from 'react-router-dom';
import moment                                    from 'moment';
import { LocationIcon, LinkIcon }                from '@primer/octicons-react';
import Donate                                    from './Donate';
import UserAvatar                                from './UserAvatar';
import ReputationGraph                           from './ReputationGraph';
import GetName                                   from '../Functions/GetName';
import GetBio                                    from '../Functions/GetBio';
import GetCity                                   from '../Functions/GetCity';
import GetWebsite                                from '../Functions/GetWebsite';
import GetProfileImg                             from '../Functions/GetProfileImg';
import GetBackgroundImg                          from '../Functions/GetBackgroundImg';
import GetNumberOfViews                          from '../Functions/GetNumberOfViews';
import GetNumberOfPosts                          from '../Functions/GetNumberOfPosts';
import GetNumberOfReplies                        from '../Functions/GetNumberOfReplies';
import GetLevel                                  from '../Functions/GetLevelAndPointsToNextLevel';
import GetPoints                                 from '../Functions/GetPoints';
import GetLastPosts                              from '../Functions/GetLastPosts';
import GetLastReplies                            from '../Functions/GetLastReplies';
import GetRankingUser                            from '../Functions/GetRankingUser';
import GetNumberOfProfileViewsAndProfileLastSeen from '../Functions/GetNumberOfProfileViewsAndProfileLastSeen';
import GetStripeUserId                           from '../Functions/GetStripeUserId';
import beautifyNumber                            from '../Functions/BeautifyNumber';
import '../Styles/PublicInfo.css';

const PublicInfo = (props) => {
    
    const uid                                    = props.match.params.string;
    const [activity, setActivity]                = useState('publicaciones');
    const [profileViews, profileLastSeen]        = GetNumberOfProfileViewsAndProfileLastSeen(uid);
    const name                                   = GetName(uid);
    const views                                  = GetNumberOfViews(uid);
    const backgroundURL                          = GetBackgroundImg(uid);
    const photoURL                               = GetProfileImg(uid);
    const points                                 = GetPoints(uid);
    const [level, pointsToNextLevel, percentage] = GetLevel(points);
    const [numPosts, setNumPosts]                = useState(10);
    const [numReplies, setNumReplies]            = useState(10);
    const posts                                  = GetLastPosts(uid, numPosts); 
    const replies                                = GetLastReplies(uid, numReplies);
    const totalPosts                             = GetNumberOfPosts(uid);
    const totalReplies                           = GetNumberOfReplies(uid);
    const ranking                                = GetRankingUser(uid);
    const stripeUserId                           = GetStripeUserId(uid);
    const bio                                    = GetBio(uid);
    const city                                   = GetCity(uid);
    const web                                    = GetWebsite(uid);
    const user                                   = {uid: uid, photoURL: photoURL};
    
    return (
        <div className = 'Public-Info'>
            <div className = 'Datos'>
                <div className = 'Header' style = {{backgroundImage: `url('${backgroundURL}')`}}>
                    {stripeUserId ? <Donate name = {name} stripeUserId = {stripeUserId}/> : null}
                    <UserAvatar user = {user}/>
                    <h2>{name}</h2>
                </div>
                <div className = 'Bio' style = {{marginTop: '20px', marginBottom: '20px'}}>
                    <div>{bio}</div>
                    <div className = 'City'>{city ? <><LocationIcon/> {city}</> : null}</div>
                    <div className = 'Web'>{web ? <><LinkIcon/> <a rel = "nofollow me" href = {`https://${web}`}>{web}</a></> : null}</div>
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
                <div className = 'Activity'>
                    <div className = 'Menu'>
                        <div onClick = {() => setActivity('publicaciones')} className = {activity === 'publicaciones' ? 'Selected' : null}>Publicaciones ({totalPosts})</div>
                        <div onClick = {() => setActivity('respuestas')}    className = {activity === 'respuestas'    ? 'Selected' : null}>Respuestas ({totalReplies})</div>
                    </div>
                    { activity === 'publicaciones'
                    ? posts.map((article, key) => <Link key = {key} to = {`/comunidad/post/${article.url}`}>{article.title}</Link>)
                    : replies.map((reply, key) => <Link key = {key} to = {`/comunidad/post/${reply.url}`}>{reply.title}</Link>)
                    }
                    { activity === 'publicaciones' && numPosts < totalPosts     ? <button onClick = {() => setNumPosts(numPosts + 10)}>Ver más</button> : null}
                    { activity === 'respuestas'    && numReplies < totalReplies ? <button onClick = {() => setNumReplies(numReplies + 10)}>Ver más</button> : null}
                </div>
            </div>
        </div>
    );
}

export default PublicInfo;