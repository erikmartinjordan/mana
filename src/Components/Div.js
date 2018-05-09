import React, { Component } from 'react';
import '../Styles/Div.css';

class Div extends Component {
    
  constructor(){
      super();
      this.state = {
          div: null
      }
  }
    
  componentDidMount = () => {
      
      let url = 'https://sheets.googleapis.com/v4/spreadsheets/1fn-LJUxVf7PtOleh1SFKe_Zn9_w23qcjKANDtnEhx0s/values/B4:F14?key=AIzaSyBskBxfwAw63g-e7BPHODVTAaH-1Ni67Eg';
      
      fetch( url, {
          method: 'GET'
       })
       .then(  res => res.json() )
       .then(  out => this.setState({ div: out }) )
       .catch( err => {throw err} );
  }
    
  render() {
      
    if(this.state.div !== null){
        
        let arr = this.state.div.values;
        var res = arr.map( value => <li>
                                        <div>{value[0]} {value[1]} {value[2]}</div>
                                        <div>{value[3]} {value[4]}</div>
                                    </li>)        
    }
          
    return (
      <div className = "Divisa">
        <h2>Divisas</h2>
        <p>Las divisas se actualizan cada pocos minutos:</p>
        <ul>
            {res}
        </ul>
      </div>
    );
  }
}

export default Div;
