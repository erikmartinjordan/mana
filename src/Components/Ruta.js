import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import firebase, { auth } from './Firebase.js';
import Login from './Login.js';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/Ruta.css';
import 'moment/locale/es';

class Ruta extends Component {
    
  constructor(){
      super();
      moment.locale('es')
      this.state = {
          alert: null,
          city: null,
          startDate: moment(),
          endDate: moment().add(1, 'days' ),
          render: true,
          route: [],
          total: 0,
          user: null
      }
  }
    
  componentDidMount = () => {
      
      document.title = 'Ruta – Nomoresheet'; 
      document.querySelector('meta[name="description"]').content = 'Organiza tu propia ruta al viajar a Tailandia'; 
      
      auth.onAuthStateChanged( user => {
          if(user) this.setState({ 
              render: false,
              user: user 
          });
      });
  }
  
  showBanner     = ()  => this.setState({ render: true }); 
  hideBanner     = ()  => this.setState({ render: false });
  handleCity        = (city) => this.setState({ city: city.target.value  });
  handleChangeStart = (date) => this.setState({ startDate: date});
  handleChangeEnd   = (date) => this.setState({ endDate: date});
  submitForm        = () => { 
                
        var diff    = this.state.endDate - this.state.startDate;
        var days    = diff < 0 ? 1 : 1 + Math.ceil(diff / (1000 * 60 * 60 * 24));
        var city    = this.state.city;
        var start   = this.state.startDate.format('L');
        var end     = this.state.endDate.format('L');     
        var sum     = this.state.total + days;
              
        if(this.state.city !== null){
            
            this.setState({ 
                route: [...this.state.route, [city, start, end, days]], 
                total: sum 
            });
            
            firebase.database().ref('users/' + this.state.user.uid + '/ruta').set({
                ciudad: [...this.state.route, [city, start, end, days]],
                totalDias: sum
            });
        }
        else this.setState({ alert: '¡Debes introducir el nombre de la ciudad! 😅'});
  }
    
  render() {
      
        var total  = <tr className = 'Total'>
                        <td>Total</td>
                        <td></td>
                        <td></td>
                        <td>{this.state.total} días</td>
                     </tr>;
        var cities = this.state.route.map( (value, id) => <tr className = 'Recorrido' key = {id}>
                                                            <td><span className = 'Num'>{id + 1}</span> {value[0]}</td>
                                                            <td>{value[1]}</td>
                                                            <td>{value[2]}</td>
                                                            <td>{value[3]} {value[3] > 1 ? 'días' : 'día'}</td>
                                                        </tr>);
    
    return (
      [<div className = 'Ruta'>
            <h2>Diseña tu propia ruta en Tailandia</h2>
            <div className = 'Ruta-box'>
                {this.state.alert ? <p className = 'alert'>{this.state.alert}</p> : null}
                <p>Ciudad</p>
                    <input onChange = {this.handleCity} placeholder = 'Bangkok...'></input>
                <p>Llegada</p>
                <DatePicker
                    selected={this.state.startDate}
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeStart}
                />
                <p>Partida</p>
                <DatePicker
                    selected={this.state.endDate}
                    selectsEnd
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeEnd}
                />
            </div>
            <button className = 'Add' onClick = {this.submitForm}>Añadir</button>
            {this.state.route.length > 0 ?
                <div>                      
                    <h2>Rutas</h2>
                    <table>
                        {cities}  
                        {total}
                    </table>
                </div>
                :
                null
            }
      </div>,
      <div>
        {this.state.render ? <Login hide={this.hideBanner}></Login> : null}
      </div>]
    );
  }
}

export default Ruta;
