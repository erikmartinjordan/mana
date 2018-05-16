import React, { Component } from 'react';
import firebase, {auth} from './Firebase.js';
import Login from './Login.js';
import '../Styles/Div.css';

class Div extends Component {
    
  constructor(){
      super();
      this.state = {
          div: null,
          render: true
      }
  }
    
  componentDidMount = () => {
      
      document.title = 'Divisas – Nomoresheet'; 
      document.querySelector('meta[name="description"]').content = 'Cambio de divisa diario'; 
      
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
      
       window.twemoji.parse(document.getElementById('root'));
  }
  
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'));
  
  showBanner = () => this.setState({ render: true }); 
  hideBanner = () => this.setState({ render: false });
    
  render() {
      
    if(this.state.div !== null){
        
        let arr = this.state.div.values;
        var res = arr.map( value => <li>
                                        <div>{value[0]} {value[1]} {value[2]}</div>
                                        <div>{value[3]} {value[4]}</div>
                                    </li>)        
    }
          
    return (
      [<div className = 'Divisa'>
        <h2>Divisas</h2>
        <p>Las divisas se actualizan cada pocos minutos:</p>
        <ul>
            {res}
        </ul>
      </div>,
      <div>
        {this.state.render ? <Login hide={this.hideBanner}></Login> : null}
      </div>]
    );
  }
}

export default Div;
