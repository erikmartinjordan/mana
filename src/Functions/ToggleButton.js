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
      
    return  <div className = {'button-' + props.status} > 
                <div className = {'inner-button-' + props.status}> 
                    {props.icon}
                </div>
            </div>;
}

export default ToggleButton; 