import React, { Component } from 'react';
import { Link }    from 'react-router-dom';
import firebase, {auth} from './Firebase.js';
import Login from './Login';
import Search from './Search';
import '../Styles/Nav.css';

class Nav extends Component {
    
  constructor(){
      super();
      this.state = {
          avatarMenu: false,
          invisible: false,
          render: false,
          show: true
      }
  }
    
  componentDidMount     = () => auth.onAuthStateChanged( user => this.setState({ user: user }) );
  showBanner            = () => this.setState({ render: true }); 
  hideBanner            = () => this.setState({ render: false }); 
  showAvatarMenu        = () => this.setState({ avatarMenu: true, invisible: true });
  signOut               = () => auth.signOut().then( this.setState({ user: null }) );
  hideSearch            = () => this.setState({ avatarMenu: false, invisible: false });
    
  render() { 
            
    return (
      <div className = 'Nav'>
        { this.state.invisible ? <div onClick = {this.hideSearch} className = 'Invisible'></div> : null}
        <div className = 'Wrap'>
            <div className = 'Title'>
                <Link to = '/'>Nomoresheet</Link>
            </div>
            <div className = 'Title-Mobile'>
                <Link to = '/'>Nms</Link>
            </div>
            <Search></Search>
            <div className = 'Menu'>
                <Link to = '/'>Comunidad</Link>
                <Link to = '/blog'>Artículos</Link>
                { !this.state.user 
                    ? <button onClick = {this.showBanner} className = 'login'>Entrar</button>
                    : <div className = 'User' onClick = {this.showAvatarMenu} >
                            <div className = 'Img-Wrap'>
                                <img src = {this.state.user.photoURL}></img>
                            </div>
                            { this.state.avatarMenu
                            ? <div className = 'Avatar-Menu'>
                                <Link to = '/perfil'>Perfil</Link>
                                <div className = 'Separator'></div>
                                <Link to = '/ruta'>Ruta</Link>
                                <Link to = '/temperatura'>Clima</Link>
                                <Link to = '/divisas'>Divisas</Link> 
                                <Link to = '/calculadora'>Calculadora</Link>
                                <div className = 'Separator'></div>
                                <Link to = '/'><div onClick = {this.signOut} className = 'Logout'>Cerrar sesión</div></Link>
                              </div>
                            : null}
                      </div>
                }
            </div>
        </div>
        {this.state.render ? <Login hide = {this.hideBanner}></Login> : null}
      </div>
    );
  }
}

export default Nav;
