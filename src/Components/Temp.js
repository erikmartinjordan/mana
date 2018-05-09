import React, { Component } from 'react';
import '../Styles/Temp.css';

class Temp extends Component {
    
  constructor(){
      super();
      this.state = {
          div: null
      }
  }
    
  componentDidMount = () => {
      
      let url = 'https://api.openweathermap.org/data/2.5/group?id=1609350,1153671,1151254,1153269,1605279,1150533,1611110,1152633,1150515&units=metric&APPID=95f2daf49b6c746f198f91ee0d30adeb';
      
      fetch( url, {
          method: 'GET'
       })
       .then(  res => res.json() )
       .then(  out => this.setState({ div: out }) )
       .catch( err => {throw err} );
  }
    
  render() {
      
    if(this.state.div !== null){
        
        let arr = this.state.div.list;
        var res = arr.map( (val, key) => {
            
            let emoji;
            let name = val.name;
                                    
            switch(val.weather['0'].description){
                case 'clear sky':                       emoji = '🌞'; break;
                case 'few clouds':                      emoji = '🌤'; break;
                case 'scattered clouds':                emoji = '⛅'; break;
                case 'broken clouds':                   emoji = '🌥'; break;
                case 'shower rain':                     emoji = '🌦'; break;
                case 'light rain':                      emoji = '🌧'; break;
                case 'moderate rain':                   emoji = '🌧'; break;
                case 'rain':                            emoji = '🌧'; break;
                case 'thunderstorm':                    emoji = '⛈'; break;
                case 'thunderstorm with light rain':    emoji = '⛈'; break;
                case 'snow':                            emoji = '🌨'; break;
                case 'mist':                            emoji = '🌫'; break;
                default:                                emoji = '🌡'; break;
            }
            
            switch(val.name){
                case 'Chon Buri': name = 'Pattaya'; break;
                case 'Trat':      name = 'Ko Chang'; break;
                default: break;
            }
            
            return  <li key = {key}>
                        <div>{name}</div>
                        <div>{Math.round(val.main.temp)} ºC {emoji}</div>
                    </li>;
        });
    }
          
    return (
      <div className = 'Temp'>
        <h2>Temperatura actual</h2>
        <p>Los datos de temperatura se actualizan cada pocos minutos:</p>
        <ul>
            {res}
        </ul>
        <h2>Temperatura media</h2>
        <div className = 'Temp__avg'>
            <div className = 'mes' id = 'enero'><span className = 'temp'>24ºC</span><span className = 'tag'>Ene</span></div>
            <div className = 'mes' id = 'febrero'><span className = 'temp'>26ºC</span><span className = 'tag'>Feb</span></div>
            <div className = 'mes' id = 'marzo'><span className = 'temp'>28ºC</span><span className = 'tag'>Mar</span></div>
            <div className = 'mes' id = 'abril'><span className = 'temp'>29ºC</span><span className = 'tag'>Abr</span></div>
            <div className = 'mes' id = 'mayo'><span className = 'temp'>29ºC</span><span className = 'tag'>May</span></div>
            <div className = 'mes' id = 'junio'><span className = 'temp'>28ºC</span><span className = 'tag'>Jun</span></div>
            <div className = 'mes' id = 'julio'><span className = 'temp'>28ºC</span><span className = 'tag'>Jul</span></div>
            <div className = 'mes' id = 'agosto'><span className = 'temp'>27ºC</span><span className = 'tag'>Ago</span></div>
            <div className = 'mes' id = 'septiembre'><span className = 'temp'>27ºC</span><span className = 'tag'>Sep</span></div>
            <div className = 'mes' id = 'octubre'><span className = 'temp'>27ºC</span><span className = 'tag'>Oct</span></div>
            <div className = 'mes' id = 'noviembre'><span className = 'temp'>26ºC</span><span className = 'tag'>Nov</span></div>
            <div className = 'mes' id = 'diciembre'><span className = 'temp'>24ºC</span><span className = 'tag'>Dic</span></div>
       </div>
        <h2>Mejor época para visitar Tailandia</h2>
        <div className = 'Mejor__epc'>
            <table>
                <tbody>
                    <tr><td>🌞 Templada</td><td>25ºC</td><td>Noviembre – Febrero</td></tr>
                    <tr><td>🔥 Calurosa</td><td>28ºC</td><td>Marzo – Junio</td></tr>
                    <tr><td>🌧 Lluviosa</td><td>27ºC</td><td>Julio – Octubre</td></tr>
                </tbody>
            </table>
        </div>
      </div>
    );
  }
}

export default Temp;
