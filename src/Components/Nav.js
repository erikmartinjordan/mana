import React, { useState, useEffect }   from 'react';
import { Link }                         from 'react-router-dom';
import Login                            from './Login';
import Perfil                           from './Perfil';
import NewPost                          from './NewPost';
import ToggleButton                     from './ToggleButton';
import UserAvatar                       from './UserAvatar';
import NightModeToggleButton            from './NightModeToggleButton';
import firebase, {auth}                 from '../Functions/Firebase';
import GetUnreadNotifications           from '../Functions/GetUnreadNotifications';
import GetPoints                        from '../Functions/GetPoints';
import GetLevel                         from '../Functions/GetLevelAndPointsToNextLevel';
import NomoresheetLogo                  from '../Functions/NomoresheetLogo';
import { ReactComponent as ThaiFlag }   from '../Assets/thailand.svg';
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
    
    useEffect(() => {
        
        let currentUrl = window.location.href;
        
        if(user && currentUrl.includes('?'))
            setPerfil(true);
        
    }, [user, window.location.href]);
  
    const menuNotUser = () => {
      
        return  <React.Fragment>
                    <Link to = '/tag/tailandia'  className = 'Tag'><div className = 'Icon'><ThaiFlag/></div>Tailandia</Link>
                    <Link to = '/tag/actualidad' className = 'Tag'><div className = 'Icon'>#</div>Actualidad</Link>
                    <Link to = '/tag/tecnologia' className = 'Tag'><div className = 'Icon'>#</div>Tecnología</Link>
                    <Link to = '/tag/relaciones' className = 'Tag'><div className = 'Icon'>#</div>Relaciones</Link>
                    <NightModeToggleButton></NightModeToggleButton>
                    <a onClick = {() => setLogin(true)} className = 'login'>Acceder</a>
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
                                <span className = 'Points'>Nivel {level} <GetUnreadNotifications user = {user}/></span>
                            </div>
                        </div>
                        <div className = 'Separator'></div>
                        <Link to = '/tag/tailandia'  className = 'Tag'><div className = 'Icon'><ThaiFlag/></div>Tailandia</Link>
                        <Link to = '/tag/actualidad' className = 'Tag'><div className = 'Icon'>#</div>Actualidad</Link>
                        <Link to = '/tag/tecnologia' className = 'Tag'><div className = 'Icon'>#</div>Tecnología</Link>
                        <Link to = '/tag/relaciones' className = 'Tag'><div className = 'Icon'>#</div>Relaciones</Link>
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
            {perfil         && <Perfil          hide = {() => setPerfil(false)}/>}
            {login          && <Login           hide = {() => setLogin(false)}/>}
            {post           && <NewPost         hide = {() => setPost(false)}/>}
        </div>
    );
}

export default Nav;