import React, { useState, useEffect } from 'react';
import { Link }    from 'react-router-dom';
import firebase, {auth} from '../Functions/Firebase.js';
import Login from './Login';
import NewPost from '../Functions/NewPost';
import Notifications from './Notifications';
import GetNumberOfPosts from '../Functions/GetNumberOfPosts.js';
import GetNumberOfReplies from '../Functions/GetNumberOfReplies.js';
import GetNumberOfSpicy from '../Functions/GetNumberOfSpicy.js';
import GetPoints from '../Functions/GetPoints.js';
import GetLevel from '../Functions/GetLevelAndPointsToNextLevel.js';
import ToggleButton from '../Functions/ToggleButton.js';
import '../Styles/Nav.css';
import '../Styles/Progressbar.css';

const Nav = () => {
    
    const [avatar, setAvatar] = useState(null);
    const [invisible, setInvisible] = useState(null);
    const [menu, setMenu] = useState(false);
    const [post, setPost] = useState(false);
    const [render, setRender] = useState(false);
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
                        
                        var capture = snapshot.val();
                        
                        // If user is anonymous, load avatar
                        if(capture.anonimo) setAvatar(capture.avatar);
                        else                setAvatar(null);
                        
                        // Setting all the info of the user
                        setUserInfo(capture);
                    }
              });

              setUser(user); 
              setUid(user.uid);
          }
          
          else{
              setUser(null);
          }
      
      });
      // Declaring variable
      var local;
      
      // Getting current theme from local storage
      local = localStorage.getItem('theme');
            
      // Setting the theme
      local === 'dark' 
      ? document.documentElement.setAttribute('data-theme','dark') 
      : document.documentElement.setAttribute('data-theme','');
      
      // Setting the state
      setTheme(local);
      
      // Setting emojis in svg
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
      
  }, []);
  
  
  const changeTheme = () => {
            
      // Is dark theme activated?
      theme === 'dark' 
      ? document.documentElement.setAttribute('data-theme','') 
      : document.documentElement.setAttribute('data-theme','dark');
      
      // New theme
      theme === 'dark' 
      ? localStorage.setItem('theme', '') 
      : localStorage.setItem('theme', 'dark');
      
      // Setting the theme
      theme === 'dark'
      ? setTheme('')
      : setTheme('dark');
  }
  
  const menuNotUser = () => {
      
        return        <React.Fragment>
                        <a onClick = {() => changeTheme()}>{theme === 'dark' ? '🌞' : '🌙'}</a>
                        <Link to = '/'>Comunidad</Link>
                        <Link to = '/blog'>Blog</Link>
                        <Link to = '/acerca'>Acerca</Link>
                        <a onClick = {() => setRender(true)} className = 'login'>Acceder</a>
                      </React.Fragment>;
      
  }
  
  const menuUser = () => {
      
        return         <div className = 'User'>
                            <div className = 'Bar-Wrap'> 
                                <Notifications user = {user}></Notifications>
                                <div onClick = {() => setMenu(true)} className = 'Img-Wrap'>
                                    <div className = {'Progress ProgressBar-' + percentage}>
                                        <img src = { avatar ? avatar : user.photoURL}></img>
                                        {userInfo && userInfo.account === 'premium' && <div className = 'Tag'>Pro</div>}
                                    </div>
                                    <span className = 'Points'>Nivel {level}</span>
                                </div>
                                <Link to = '/' onClick = {() => setPost(true)} className = 'New-Post'>Publicar </Link>
                            </div>
                            {menu && menuClicked()}
                        </div>;
  }
  
  const menuClicked = () => {
      
        return            <div className = 'Avatar-Menu'>
                                <Link to = '/perfil' onClick = {() => setMenu(false)}>Perfil</Link>
                                <div className = 'Separator'></div>
                                <Link to = '/'       onClick = {() => setMenu(false)}>Comunidad</Link>
                                <Link to = '/blog'   onClick = {() => setMenu(false)}>Blog</Link> 
                                <Link to = '/acerca' onClick = {() => setMenu(false)} >Acerca</Link>
                                <div className = 'Separator'></div>
                                <a onClick = {() => changeTheme()}>Modo noche
                                {theme === 'dark' ? <ToggleButton status = 'on'/> : <ToggleButton status = 'off'/>}
                                </a>
                                <div className = 'Separator'></div>
                                <Link to = '/' onClick = {() => setMenu(false)}>
                                    <div onClick = {() => auth.signOut().then(setUser(null))} className = 'Logout'>Cerrar sesión</div>
                                </Link>
                          </div>;
      
  }
    
  return (
      <div className = 'Nav'>
        <div className = 'Wrap'>
            <div className = 'Title'>
                <Link to = '/'>N</Link>
            </div>
            <div className = 'Menu'>
                { user ? menuUser() : menuNotUser() }
            </div>
        </div>
        {render && <Login hide = {() => setRender(false)}></Login>}
        {menu   && <div onClick = {() => setMenu(false)} className = 'Invisible'></div>}
        {post   && <NewPost hide = {() => setPost(false)}></NewPost>}
      </div>
  );
}

export default Nav;
