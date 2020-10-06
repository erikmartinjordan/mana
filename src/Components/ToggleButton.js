import React   from 'react';
import Twemoji from './Twemoji';
import '../Styles/ToggleButton.css';

const ToggleButton = ({status, icon}) => {

    return(
        <div className = {'button-' + status} > 
            <div className = {'inner-button-' + status}> 
                <Twemoji emoji = {icon}/>
            </div>
        </div>
    );
    
}

export default ToggleButton; 