import React, {useEffect} from 'react';
import '../Styles/ToggleButton.css';

//
// Returns a toggle button on/off depending on props.status
//

const ToggleButton = (props) => {
    
    var button; 
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });
      
      
    props.status === 'on'
    ? button = <div className = 'button-on'> <div className = 'inner-button-on'> {props.icon}</div></div>
    : button = <div className = 'button-off'><div className = 'inner-button-off'>{props.icon}</div></div>;
      
    return button;
 
}

export default ToggleButton; 