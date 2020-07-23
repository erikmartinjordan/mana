import React, { useState, useEffect }   from 'react';
import { Link }                         from 'react-router-dom';
import Fingerprint                      from 'fingerprintjs';
import moment                           from 'moment';
import Login                            from './Login';
import Notifications                    from './Notifications';
import Perfil                           from './Perfil';
import NewPost                          from './NewPost.js';
import firebase, {auth}                 from '../Functions/Firebase.js';
import NightModeToggleButton            from '../Functions/NightModeToggleButton.js';
import GetUnreadNotifications           from '../Functions/GetUnreadNotifications.js';
import GetPoints                        from '../Functions/GetPoints.js';
import GetLevel                         from '../Functions/GetLevelAndPointsToNextLevel.js';
import ToggleButton                     from '../Functions/ToggleButton.js';
import UserAvatar                       from '../Functions/UserAvatar.js';
import NomoresheetLogo                  from '../Functions/NomoresheetLogo.js';
import '../Styles/Nav.css';

const Nav = () => {
    
    const [avatar, setAvatar]               = useState(null);
    const [invisible, setInvisible]         = useState(null);
    const [lastSignIn, setLastSignIn]       = useState(null)
    const [menu, setMenu]                   = useState('');
    const [notifications, setNotifications] = useState(false);
    const [post, setPost]                   = useState(false);
    const [login, setLogin]                 = useState(false);
    const [perfil, setPerfil]               = useState(false);
    const [show, setShow]                   = useState(true);
    const [theme, setTheme]                 = useState('');
    const [uid, setUid]                     = useState(null);
    const [user, setUser]                   = useState(null);
    const [userInfo, setUserInfo]           = useState(null);
    const points                            = GetPoints(uid);
    const level                             = GetLevel(...points)[0];
    const percentage                        = GetLevel(...points)[2];
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });

    useEffect ( () => {
      
        auth.onAuthStateChanged( user => {

            if(user) {
                
                firebase.database().ref(`users/${user.uid}`).on( 'value', snapshot => {
                    
                    if(snapshot.val()){
                        
                        let date    = new Date(parseInt(user.metadata.b));
                        let day     = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                        let hour    = `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}`;
                        let capture = snapshot.val();
                        
                        capture.anonimo 
                        ? setAvatar(capture.avatar)
                        : setAvatar(null);
                        
                        setUserInfo(capture);
                        setLastSignIn(`Accediste el ${day} a las ${hour}`);
                    }
                });
                
                setUid(user.uid);
                
            }
            
            setUser(user);
            
        });
      
  }, []);
  
    const menuNotUser = () => {
      
        return  <React.Fragment>
                    <Link to = '/'>Comunidad</Link>
                    <Link to = '/blog'>Blog</Link>
                    <Link to = '/acerca'>Acerca</Link>
                    <NightModeToggleButton></NightModeToggleButton>
                    <a onClick = {() => setLogin(true)} className = 'login'>Acceder</a>
                    <Ad/>
                </React.Fragment>;  
    }
  
    const menuUser = () => {
      
        return      <React.Fragment>
                        <div onClick = {() => setPerfil(true)} className = 'Img-Wrap'>
                            <UserAvatar user = {user} allowAnonymousUser = {true}/>
                            <div className = 'Name-Points'>
                                <span className = 'Name'>
                                    {user && userInfo  && userInfo.anonimo  && userInfo.nickName}
                                    {user && userInfo  && !userInfo.anonimo && user.displayName}
                                    {user && !userInfo && user.displayName}
                                </span>
                                <span className = 'Points'>Nivel {level}</span>
                            </div>
                        </div>
                        <div className = 'Separator'></div>
                        <div className = 'NotificationsContainer' onClick = {() => setNotifications(true)}>
                            <span>Notificaciones</span>
                            <GetUnreadNotifications user = {user}/>
                        </div>
                        <Link to = '/'       onClick = {() => setMenu(false)}>Comunidad</Link>
                        <Link to = '/blog'   onClick = {() => setMenu(false)}>Blog</Link> 
                        <Link to = '/acerca' onClick = {() => setMenu(false)}>Acerca</Link>
                        <div className = 'Separator'></div>
                        <NightModeToggleButton></NightModeToggleButton>
                        <div className = 'Separator'></div>
                        <Link to = '/' onClick = {() => setPost(true)} className = 'login'>Publicar</Link>
                        <div className = 'Separator'></div>
                        <div onClick = {() => auth.signOut().then(setUser(null))} className = 'Logout'>Cerrar sesión</div>
                        <div className = 'SignIn'>{lastSignIn}</div>
                    </React.Fragment>;
    }
    
    return (
        <div className = {'Nav ' + menu}>
                <div className = 'Nomoresheet' onClick = {() => menu === 'Mobile' ? setMenu(''): setMenu('Mobile')}>
                    <NomoresheetLogo/>
                    <i className = {menu === 'Mobile' ? 'Up' : 'Down'}></i>
                </div>
                <div className = {'Menu ' + menu} onClick = {() => setMenu('')}>
                    {user ? menuUser() : menuNotUser()}
                </div>
            {notifications  && <Notifications   hide = {() => setNotifications(false)} user = {user}/>}
            {perfil         && <Perfil          hide = {() => setPerfil(false)}/>}
            {login          && <Login           hide = {() => setLogin(false)}/>}
            {post           && <NewPost         hide = {() => setPost(false)}/>}
        </div>
    );
}

export default Nav;


const Ad = () => {
    
    const ads = [
        
        {
            "campaign": 'AirBnB',
            "link": 'https://www.airbnb.es/c/erikm3737?currency=EUR',
            "text": 'Obtén 34 euros de descuento en tu primera reserva de AirBnB'
            
        },
        {
            
            "campaign": 'Amazon',
            "link": 'https://amzn.to/39lC2sk',
            "text": 'Auriculares inalámbricos por menos de 30 euros'
            
        },
        {
            
            "campaign": 'Agoda',
            "link": 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1772106&city=9395',
            "text": 'Agoda para hoteles baratos'
            
        }
        
    ]
    
    const [random, setRandom] = useState(Math.floor(ads.length * Math.random()));
    
    const handleAd = (campaign) => {
        
        var fingerprint = new Fingerprint().get();
        var date        = moment().format('YYYYMMDD');
        
        firebase.database().ref(`ads/${campaign}/${date}/${fingerprint}/clicks/`).transaction(value => value + 1);
    }
    
    return(
        
        <a className = 'Ad' href = {ads[random].link} onClick = {() => handleAd(ads[random].campaign)} target = '_blank' rel = 'noopener noreferrer nofollow'>
            <span className = 'Title'>Anuncio</span>
            <p>{ads[random].text}</p>
        </a>
    );
    
}
