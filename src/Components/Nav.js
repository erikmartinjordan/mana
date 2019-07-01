import React, { Component } from 'react';
import { Link }    from 'react-router-dom';
import firebase, {auth} from './Firebase.js';
import Login from './Login';
import NewPost from './Forum/NewPost';
import Notifications from './Notifications';
import '../Styles/Nav.css';

class Nav extends Component {
    
  constructor(){
      super();
      this.state = {
          invisible: false,
          menu: false,
          render: false,
          post: false,
          show: true,
          theme: '',
      }
  }
    
  componentDidMount = () => {
      
      // Is user authenticated?
      auth.onAuthStateChanged( user => this.setState({ user: user }) );
      
      // Getting current theme from local storage
      const theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
            
      // Setting the theme
      theme === 'dark' ? document.documentElement.setAttribute('data-theme','dark') : document.documentElement.setAttribute('data-theme','');
      
      // Setting the state
      this.setState({ theme });
      
      // Setting emojis in svg
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
      
  }
  
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} ); 
  
  changeTheme = () => {
      
      // Theme
      var theme = this.state.theme;
      
      // Is dark theme activated?
      theme === 'dark' ? document.documentElement.setAttribute('data-theme','') : document.documentElement.setAttribute('data-theme','dark');
      
      // New theme
      theme === 'dark' ? theme = '' : theme = 'dark';
      
      // Save in local storage
      localStorage.setItem('theme', theme);
      
      // Setting the theme
      this.setState({ theme });
  }
  
  showBanner            = () => this.setState({ render: true }); 
  hideBanner            = () => this.setState({ render: false }); 
  showMenu              = () => this.setState({ menu: true });
  hideMenu              = () => this.setState({ menu: false });
  showPost              = () => this.setState({ post: true });
  hidePost              = () => this.setState({ post: false });
  signOut               = () => auth.signOut().then( this.setState({ user: null }) );

  toggleButton = (status) => {
      
      var button; 
      
      if(status === 'on') button = <div className = 'button-on'><div className = 'inner-button-on'></div></div>;
      else                button = <div className = 'button-off'><div className = 'inner-button-off'></div></div>;
      
      return button;
          
  }

    
  render() {       
    return (
      <div className = 'Nav'>
        <div className = 'Wrap'>
            <div className = 'Title'>
                <Link to = '/'>N</Link>
            </div>
            <div className = 'Title-Mobile'>
                <Link to = '/'>N</Link>
            </div>
            <div className = 'Menu'>
                { !this.state.user 
                    ? <React.Fragment>
                        <a onClick = {this.changeTheme}>{this.state.theme === 'dark' ? '🌞' : '🌙'}</a>
                        <Link to = '/'>Comunidad</Link>
                        <Link to = '/blog'>Blog</Link>
                        <Link to = '/acerca'>Acerca</Link>
                        <a onClick = {this.showBanner} className = 'login'>Acceder</a>
                      </React.Fragment>
                    : <div className = 'User'>
                            <div className = 'Img-Wrap'> 
                                <Notifications user = {this.state.user}></Notifications>
                                <img onClick = {this.showMenu}  src = {this.state.user.photoURL}></img>        
                                <Link to = '/' onClick = {this.showPost} className = 'New-Post'>Publicar</Link>
                            </div>
                            { this.state.menu
                            ? <div className = 'Avatar-Menu'>
                                <Link to = '/perfil' onClick = {this.hideMenu}>Perfil</Link>
                                <div className = 'Separator'></div>
                                <Link to = '/' onClick = {this.hideMenu}>Comunidad</Link>
                                <Link to = '/blog' onClick = {this.hideMenu}>Blog</Link> 
                                <Link to = '/acerca' onClick = {this.hideMenu} >Acerca</Link>
                                <div className = 'Separator'></div>
                                <a onClick = {this.changeTheme}>Modo noche{this.state.theme === 'dark' ? this.toggleButton('on') : this.toggleButton('off')}</a>
                                <div className = 'Separator'></div>
                                <Link to = '/' onClick = {this.hideMenu}><div onClick = {this.signOut} className = 'Logout'>Cerrar sesión</div></Link>
                              </div>
                            : null}
                      </div>
                }
            </div>
        </div>
        {this.state.render ? <Login hide = {this.hideBanner}></Login> : null}
        {this.state.menu   ? <div onClick = {this.hideMenu} className = 'Invisible'></div> : null}
        {this.state.post   ? <NewPost hide = {this.hidePost}></NewPost> : null}
      </div>
    );
  }
}

export default Nav;
