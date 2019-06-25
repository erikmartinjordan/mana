import React, { Component } from 'react';
import { Link }    from 'react-router-dom';
import firebase, {auth} from './Firebase.js';
import Login from './Login';
import NewPost from './Forum/NewPost';
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
      
  }
  
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
                                <img onClick = {this.showMenu}  src = {this.state.user.photoURL}></img>        
                                <Link to = '/' onClick = {this.showPost} className = 'New-Post'>Publicar</Link>
                            </div>
                            { this.state.menu
                            ? <div className = 'Avatar-Menu' onClick = {this.hideMenu}>
                                <Link to = '/perfil'>Perfil</Link>
                                <div className = 'Separator'></div>
                                <Link to = '/'>Comunidad</Link>
                                <Link to = '/Blog'>Blog</Link> 
                                <Link to = '/Acerca'>Acerca</Link>
                                <div className = 'Separator'></div>
                                <a onClick = {this.changeTheme}>Cambiar a modo {this.state.theme === 'dark' ? 'día' : 'noche'}</a>
                                <div className = 'Separator'></div>
                                <Link to = '/'><div onClick = {this.signOut} className = 'Logout'>Cerrar sesión</div></Link>
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
