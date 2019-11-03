import React, { useState, useEffect }   from 'react';
import { Link }                         from 'react-router-dom';
import Login                            from './Login';
import Notifications                    from './Notifications';
import Perfil                           from './Perfil';
import firebase, {auth}                 from '../Functions/Firebase.js';
import NightModeToggleButton            from '../Functions/NightModeToggleButton.js';
import NewPost                          from '../Functions/NewPost';
import GetNumberOfPosts                 from '../Functions/GetNumberOfPosts.js';
import GetNumberOfReplies               from '../Functions/GetNumberOfReplies.js';
import GetNumberOfSpicy                 from '../Functions/GetNumberOfSpicy.js';
import GetPoints                        from '../Functions/GetPoints.js';
import GetLevel                         from '../Functions/GetLevelAndPointsToNextLevel.js';
import ToggleButton                     from '../Functions/ToggleButton.js';
import '../Styles/Nav.css';
import '../Styles/Progressbar.css';

const Nav = () => {
    
    const [avatar, setAvatar] = useState(null);
    const [invisible, setInvisible] = useState(null);
    const [lastSignIn, setLastSignIn] = useState(null)
    const [menu, setMenu] = useState('');
    const [post, setPost] = useState(false);
    const [login, setLogin] = useState(false);
    const [perfil, setPerfil] = useState(false);
    const [show, setShow] = useState(true);
    const [theme, setTheme] = useState('');
    const [uid, setUid] = useState(null);
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const posts = GetNumberOfPosts(uid);
    const replies = GetNumberOfReplies(uid);
    const spicy = GetNumberOfSpicy(uid);
    const points = GetPoints(posts, replies, spicy)[0];
    const level = GetLevel(points)[0];
    const percentage = GetLevel(points)[2];

    useEffect ( () => {
      
      // Is user authenticated?
      auth.onAuthStateChanged( user => {
    
          if(user) {
              // Getting user's properties
              firebase.database().ref('users/' + user.uid).on( 'value', snapshot => {
                    if(snapshot.val()){
                        
                        var date = new Date(parseInt(user.metadata.b));
                        var capture = snapshot.val();
                        
                        // If user is anonymous, load avatar
                        if(capture.anonimo) setAvatar(capture.avatar);
                        else                setAvatar(null);
                        
                        // Setting all the info of the user
                        setUserInfo(capture);
                        setLastSignIn(`Accediste el ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} a las ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '')}${date.getMinutes()}`);
                    }
              });

              setUser(user); 
              setUid(user.uid);
          }
          
          else{
              setUser(null);
          }
      
      });
      
      // Setting emojis in svg
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
      
  }, []);
  
  
    const menuNotUser = () => {
      
        return  <React.Fragment>
                    <Link to = '/'>Comunidad</Link>
                    <Link to = '/blog'>Blog</Link>
                    <Link to = '/acerca'>Acerca</Link>
                    <NightModeToggleButton></NightModeToggleButton>
                    <a onClick = {() => setLogin(true)} className = 'login'>Acceder</a>
                </React.Fragment>;  
    }
  
    const menuUser = () => {
      
        return      <React.Fragment>
                        <div onClick = {() => setPerfil(true)} className = 'Img-Wrap'>
                            <div className = {'Progress ProgressBar-' + percentage}>
                                <img src = { avatar ? avatar : user.photoURL}></img>
                                {userInfo && userInfo.account === 'premium' && <div className = 'Tag'>✨</div>}
                            </div>
                            <div className = 'Name-Points'>
                                <span className = 'Name'>
                                    {user && userInfo && userInfo.anonimo  && userInfo.nickName}
                                    {user && userInfo && !userInfo.anonimo && user.displayName}
                                </span>
                                <span className = 'Points'>Nivel {level}</span>
                            </div>
                        </div>
                        <div className = 'Separator'></div>
                        <Notifications user = {user}/>
                        <Link to = '/'       onClick = {() => setMenu(false)}>Comunidad</Link>
                        <Link to = '/blog'   onClick = {() => setMenu(false)}>Blog</Link> 
                        <Link to = '/acerca' onClick = {() => setMenu(false)} >Acerca</Link>
                        <div className = 'Separator'></div>
                        <NightModeToggleButton></NightModeToggleButton>
                        <div className = 'Separator'></div>
                        <Link to = '/' onClick = {() => setPost(true)} className = 'login'>Publicar </Link>
                        <div className = 'Separator'></div>
                        <div onClick = {() => auth.signOut().then(setUser(null))} className = 'Logout'>Cerrar sesión</div>
                        <div className = 'SignIn'>{lastSignIn}</div>
                    </React.Fragment>;
    }
    
    return (
        <div className = {'Nav ' + menu}>
                <div className = 'Nomoresheet' onClick = {() => menu === 'Mobile' ? setMenu(''): setMenu('Mobile')}>
                    <Link to = '/'>N</Link>
                    <i className = {menu === 'Mobile' ? 'Up' : 'Down'}></i>
                </div>
                <div className = {'Menu ' + menu}>
                    {user ? menuUser() : menuNotUser()}
                </div>
            {perfil        && <Perfil  hide = {() => setPerfil(false)}/>}
            {login         && <Login   hide = {() => setLogin(false)}/>}
            {post          && <NewPost hide = {() => setPost(false)}/>}
        </div>
    );
}

export default Nav;
