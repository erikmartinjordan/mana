import React    from 'react';
import { Link } from 'react-router-dom';

const NomoresheetLogo = () => {
    
    let style = {
        background: 'var(--nmsLogo)',
        borderRadius: '5px',
        color: 'white',
        fontSize: '30px',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        lineHeight: '1',
        padding: '5px 10px 5px 10px'
    }
    
    return(<Link to = '/' style = {style}>N</Link>);

}

export default NomoresheetLogo;