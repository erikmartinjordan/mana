import React, { Component } from 'react';
import firebase, { auth } from './Firebase.js';
import Login from './Login.js';
import '../Styles/Perfil.css';

class Perfil extends Component {

  constructor(){
      super();
      this.state = {
         infoUser: null,
         render: true,
         user: null
      }
  }
    
  componentDidMount = () => {
      
      document.title = 'Perfil – Nomoresheet'; 
      document.querySelector('meta[name="description"]').content = 'Este es tu perfil en Nomoresheet...';
      
      auth.onAuthStateChanged( user => {

          if(user){
              this.setState({ 
                  render: false,
                  user: user 
              });
              firebase.database().ref('users/' + this.state.user.uid).on( 'value', (snapshot) => {

                  var object = snapshot.val();
                  this.setState({ infoUser: object });

              });
          }
      });
  }
  
  showBanner = () => this.setState({ render: true }); 
  hideBanner = () => this.setState({ render: false });
    
  render() {
      
    if(this.state.user && this.state.infoUser){
        
        var nombre = this.state.user.displayName;
        var img = this.state.user.photoURL;
        
        var pais = 'No se sabe...';
        var presupuesto = 'Mmmmmm...';
        var divisa = '';
        var viajero = '¿Lo qué?';
        var cities = <tr><td>Sin ruta</td></tr>;
        
        if(typeof(this.state.infoUser.presupuesto) !== 'undefined'){
            pais = this.state.infoUser.presupuesto.pais;
            presupuesto = (this.state.infoUser.presupuesto.presupuesto / this.state.infoUser.presupuesto.conversionRate).toFixed(2).replace('.', ',');
            divisa = this.state.infoUser.presupuesto.coinSymbol;
            viajero = this.state.infoUser.presupuesto.viajero;  
        }
        if(typeof(this.state.infoUser.ruta) !== 'undefined'){
            cities = this.state.infoUser.ruta.ciudad.map( (value, id) => <tr className = 'Recorrido' key = {id}>
                                                                <td>{value[0]}</td>
                                                                <td>{value[1]}</td>
                                                                <td>{value[2]}</td>
                                                                <td>{value[3]} {value[3] > 1 ? 'días' : 'día'}</td>
                                                            </tr>);
        }
            

    }
      
          
    return (
      [<div className = 'Perfil'>
        <h2>Perfil</h2>
        <div className = 'Datos'>
            <img src = {img}></img>
            <h3>{nombre}</h3>
            <table>
                <tbody>
                    <tr><td>País de origen</td><td>{pais}</td></tr>
                    <tr><td>Presupuesto</td><td>{presupuesto} {divisa}</td></tr>
                    <tr><td>Tipo de viajero</td><td>{viajero}</td></tr>
                </tbody>
            </table>
            <h3>Ruta</h3>
            <table>
                <tbody>
                    {cities}
                </tbody>
            </table>
        </div>
      </div>,
      <div>
        {this.state.render ? <Login hide={this.hideBanner}></Login> : null}
      </div>]                                               
    );
  }
}

export default Perfil;
