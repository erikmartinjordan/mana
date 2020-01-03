import React from 'react';

const NomoresheetLogo = () => {
    
    let style = {
        background: 'var(--nmsLogo)',
        borderRadius: '5px',
        color: 'white',
        fontFamily: 'Gentium Book Basic, serif',
        fontSize: '30px',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        lineHeight: '1',
        padding: '5px 10px 5px 10px'
    }
    
    return(<a href = '/' style = {style}>N</a>);

}

export default NomoresheetLogo;