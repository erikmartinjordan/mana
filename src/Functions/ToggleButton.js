import React from 'react';
import '../Styles/ToggleButton.css';

//
// Returns a toggle button on/off depending on props.status
//

const ToggleButton = (props) => {
      
      var button; 
      
      props.status === 'on'
      ? button = <div className = 'button-on'> <div className = 'inner-button-on'></div></div>
      : button = <div className = 'button-off'><div className = 'inner-button-off'></div></div>;
      
      return button;
          
}

export default ToggleButton; 