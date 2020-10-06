import React, { useEffect } from 'react';

const Twemoji = ({ emoji }) => {
    
    useEffect(() => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );  
        
    });
    
    return(
        
        <span className = 'Twemoji'>{emoji}</span>
        
    );
    
}

export default Twemoji;