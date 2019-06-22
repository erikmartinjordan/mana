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
          show: true
      }
  }
    
  componentDidMount     = () => auth.onAuthStateChanged( user => this.setState({ user: user }) );
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
