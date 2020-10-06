import React, { useEffect } from 'react';

const Twemoji = ({ emoji }) => {
    
    useEffect(() => {
        
        window.twemoji.parse(document.getElementById('emoji'), {folder: 'svg', ext: '.svg'} );  
        
    });
    
    return(
        
        <span id = 'emoji'>{emoji}</span>
        
    );
    
}

export default Twemoji;