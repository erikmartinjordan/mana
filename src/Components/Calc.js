import React, { Component } from 'react';
import firebase, { auth } from './Firebase.js';
import Login from './Login.js';
import '../Styles/Calc.css';

class Calc extends Component {
    
  constructor(){
      super();
      this.state = {
          dias: 1,
          div: null,
          enviado: null,
          pais: "España",
          personas: 1,
          render: true,
          resultado: null,
          res: [],
          tours: 0,
          user: false,
          viajero: "Familiar"
      }
  }
    
  componentDidMount = () => {
      
      document.title = 'Calculadora – Nomoresheet'; 
      document.querySelector('meta[name="description"]').content = 'Calcula tu presupuesto al viajar a Tailandia'; 
      
      auth.onAuthStateChanged( user => {
          
          if(user){
              this.setState({ 
                  render: false,
                  user: user 
              });
              
              let url = 'https://sheets.googleapis.com/v4/spreadsheets/1fn-LJUxVf7PtOleh1SFKe_Zn9_w23qcjKANDtnEhx0s/values/B4:F14?key=AIzaSyBskBxfwAw63g-e7BPHODVTAaH-1Ni67Eg';
      
              fetch( url, {method: 'GET'})
               .then(  res => res.json() )
               .then(  out => this.setState({ div: out }) )
               .catch( err => {throw err} );
          }

      });
       
  }
   
  showBanner     = ()  => this.setState({ render: true }); 
  hideBanner     = ()  => this.setState({ render: false });
  handlePais     = (e) => this.setState({ pais: e.target.value });
  handlePersonas = (e) => this.setState({ personas: e.target.value }); 
  handleViajero  = (e) => this.setState({ viajero: e.target.value }); 
  handleDias     = (e) => this.setState({ dias: e.target.value });
  handleTours    = (e) => this.setState({ tours: e.target.value });
  submitForm     = (e) => {   

      e.preventDefault();

      var a = parseInt( this.state.dias, 10 );
      var b = parseInt( this.state.personas, 10);
      var c = parseInt( this.state.tours, 10);
      var d = 1;
      var conversionRate;
      var coinSymbol;
      
      switch(this.state.viajero){
          case "Familiar":  d = 1.5; break;
          case "Mochilero": d = 1; break;
          case "Jubilado":  d = 1.2; break;
          case "Ocioso":    d = 2; break;
          case "Ahorrador": d = 0.7; break;
          default: d = 1; break;
      }
      
      
      switch(this.state.pais){
          case "Argentina":      conversionRate = parseFloat(this.state.div.values[2][3].replace(",", "."));  coinSymbol = this.state.div.values[2][2]; break;
          case "Brasil":         conversionRate = parseFloat(this.state.div.values[10][3].replace(",", ".")); coinSymbol = this.state.div.values[10][2]; break;
          case "Chile":          conversionRate = parseFloat(this.state.div.values[3][3].replace(",", "."));  coinSymbol = this.state.div.values[3][2]; break;
          case "Colombia":       conversionRate = parseFloat(this.state.div.values[5][3].replace(",", "."));  coinSymbol = this.state.div.values[5][2]; break;
          case "España":         conversionRate = parseFloat(this.state.div.values[0][3].replace(",", "."));  coinSymbol = this.state.div.values[0][2]; break;
          case "Estados Unidos": conversionRate = parseFloat(this.state.div.values[1][3].replace(",", "."));  coinSymbol = this.state.div.values[1][2]; break;
          case "México":         conversionRate = parseFloat(this.state.div.values[4][3].replace(",", "."));  coinSymbol = this.state.div.values[4][2]; break;
          case "Perú":           conversionRate = parseFloat(this.state.div.values[7][3].replace(",", "."));  coinSymbol = this.state.div.values[7][2]; break;
          case "Reino Unido":    conversionRate = parseFloat(this.state.div.values[8][3].replace(",", "."));  coinSymbol = this.state.div.values[8][2]; break;
          case "Suiza":          conversionRate = parseFloat(this.state.div.values[9][3].replace(",", "."));  coinSymbol = this.state.div.values[9][2]; break;
          case "Venezuela":      conversionRate = parseFloat(this.state.div.values[6][3].replace(",", "."));  coinSymbol = this.state.div.values[6][2]; break;
          default: break;
      }
      
      
      var presupuesto = (a * b * d * 1000) + (b * c * 1000);
      
      this.setState({ resultado: [presupuesto, conversionRate, coinSymbol], enviado: true });
      
      firebase.database().ref('users/' + this.state.user.uid + '/presupuesto').set({
            pais: this.state.pais,
            viajero: this.state.viajero,
            presupuesto: presupuesto,
            conversionRate: conversionRate,
            coinSymbol: coinSymbol
      });
      
  }
    
  render() {      
    return (
      [<div className = "Calc">
        { !this.state.enviado ? 
        <div>
            <h2>Calcula tu presupuesto antes de viajar a Tailandia</h2>
            <form id = "Presupuesto">
                <p>País de origen</p>
                <select onChange = {this.handlePais} defaultValue = "España">
                    <option value = "Argentina">Argentina</option>
                    <option value = "Brasil">Brasil</option>
                    <option value = "Chile">Chile</option>
                    <option value = "Colombia">Colombia</option>
                    <option value = "España">España</option>
                    <option value = "Estados Unidos">Estados Unidos</option>
                    <option value = "México">México</option>
                    <option value = "Perú">Perú</option>
                    <option value = "Reino Unido">Reino Unido</option>
                    <option value = "Suiza">Suiza</option>
                    <option value = "Venezuela">Venezuela</option>
                </select>
                <p>Número de personas</p>
                <select onChange = {this.handlePersonas}>
                    <option value = "1">1</option>
                    <option value = "2">2</option>
                    <option value = "3">3</option>
                    <option value = "4">4</option>
                    <option value = "5">5</option>
                </select>
                <p>Tipo de viajero</p>
                <select onChange = {this.handleViajero}>
                    <option value = "Familiar">Familiar</option>
                    <option value = "Mochilero">Mochilero</option>
                    <option value = "Jubilado">Jubilado</option>
                    <option value = "Ocioso">Ocioso</option>
                    <option value = "Ahorrador">Ahorrador</option>
                </select>
                <p>Número de días</p>
                <select onChange = {this.handleDias}>
                    <option value = "1">1</option>
                    <option value = "2">2</option>
                    <option value = "3">3</option>
                    <option value = "4">4</option>
                    <option value = "5">5</option>
                    <option value = "6">6</option>
                    <option value = "7">7</option>
                    <option value = "8">8</option>
                    <option value = "9">9</option>
                    <option value = "10">10</option>
                    <option value = "11">11</option>
                    <option value = "12">12</option>
                    <option value = "13">13</option>
                    <option value = "14">14</option>
                    <option value = "15">15</option>
                    <option value = "16">16</option>
                    <option value = "17">17</option>
                    <option value = "18">18</option>
                    <option value = "19">19</option>
                    <option value = "20">20</option>
                    <option value = "21">21</option>
                    <option value = "22">22</option>
                    <option value = "23">23</option>
                    <option value = "24">24</option>
                    <option value = "25">25</option>
                    <option value = "26">26</option>
                    <option value = "27">27</option>
                    <option value = "28">28</option>
                    <option value = "29">29</option>
                    <option value = "30">30</option>
                </select>
                <p>Número de <em>tours</em></p>
                <select onChange = {this.handleTours}>
                    <option value = "0">0</option>
                    <option value = "1">1</option>
                    <option value = "2">2</option>
                    <option value = "3">3</option>
                    <option value = "4">4</option>
                    <option value = "5">5</option>
                </select>
            </form>
            <button onClick = {this.submitForm}>Calcular</button>
        </div>

        
        :
        
        <div className = "Container">
            <h2>Resultado del análisis</h2>
            <div className = "Data">
                <table>
                    <tbody>
                        <tr>
                            <td>🗺 País de origen</td>
                            <td>{this.state.pais}</td>
                        </tr>
                        <tr>
                            <td>👨‍👩‍👧 Número de personas</td>
                            <td>{this.state.personas}</td>
                        </tr>
                        <tr>
                            <td>🎒 Tipo de viajero</td>
                            <td>{this.state.viajero}</td>
                        </tr>
                        <tr>
                            <td>📅 Número de días</td>
                            <td>{this.state.dias}</td>
                        </tr>
                        <tr>
                            <td>🐘 Número de <em>tours</em></td>
                            <td>{this.state.tours}</td>
                        </tr>
                        <tr className = "Result">
                            <td>Total</td>
                            <td>{ (this.state.resultado[0] / this.state.resultado[1]).toFixed(2).replace(".", ",")} {this.state.resultado[2]}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>({this.state.resultado[0].toLocaleString()} ฿)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>}
    </div>,
    <div>
        {this.state.render ? <Login hide={this.hideBanner}></Login> : null}
    </div>]
    );
  }
}

export default Calc;
