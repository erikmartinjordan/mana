import React, {useEffect} from 'react';
import '../Styles/ToggleButton.css';

const ToggleButton = ({status, icon}) => {
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });

    return(
        <div className = {'button-' + status} > 
            <div className = {'inner-button-' + status}> 
                {icon}
            </div>
        </div>
    );
    
}

export default ToggleButton; 