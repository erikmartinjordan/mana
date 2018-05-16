import React, { Component } from 'react';
import '../Styles/Footer.css';

class Footer extends Component {
    
  constructor(){
      super();
      let date = new Date();
      this.state = {
          day: date.getDay(),
          year: date.getFullYear(),
          message: ' '
      }
  }
    
  componentDidMount = () => {
      
      let icon = ['🍩', '🏄🏻', '🤘', '🍉', '🍷', '🍭', '🍪', '🙌🏻', '🎉'];
      let day;
        
      switch(this.state.day){
        case 0: day = 'domingo';    break;
        case 1: day = 'lunes';      break;
        case 2: day = 'martes';     break;
        case 3: day = 'miércoles';  break;
        case 4: day = 'jueves';     break;
        case 5: day = 'viernes';    break;
        case 6: day = 'sábado';     break;
        default: break;
      }
            
      icon = icon[Math.floor(Math.random() * icon.length)];
      
      this.setState({ message: day + ' ' + icon});
            
  }
    
  render() {       
    return (
      <div className = 'Footer'>
        <div className = 'Wrap'>
            <p>© 2015 — {this.state.year}, <span className = 'Logo'>Nomoresheet</span> por <a href = 'https://twitter.com/ErikMarJor' className = 'Twitter'>@ErikMarJor</a></p>
            <p>Que tengas un buen {this.state.message}</p>
        </div>
      </div>
    );
  }
}

export default Footer;
