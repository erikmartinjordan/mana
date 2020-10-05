import React, { useEffect, useState } from 'react';
import '../Styles/Alert.css';

const Alert = ({title, message, seconds, setTitle, setMessage}) => {
    
    const [display, setDisplay] = useState(false);
    
    useEffect(() => {
        
        if(title && message){
            
            setDisplay(true);
            
            if(seconds){
                
                setTimeout(() => setDisplay(false), seconds * 1000);
                setTimeout(() => setTitle(null),    seconds * 1000);
                setTimeout(() => setMessage(null),  seconds * 1000);
                
            }
            
        }
        
    }, [title, message, seconds, setMessage, setTitle]);
    
    return(
        <React.Fragment>
            { display
            ? <div className = 'Alert'>
                <div className = 'Alert-Emoji'>📮</div>
                <div>
                    <div className = 'Title'>{title ? title : 'Ups...'}</div>
                    <div className = 'Message'>{message}</div>  
                </div>
              </div>
            : null
            }
        </React.Fragment>
    );
    
}

export default Alert;