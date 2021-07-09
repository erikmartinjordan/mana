import React                from 'react';
import { Link, useHistory } from 'react-router-dom';

const NomoresheetLogo = () => {

    const history = useHistory();
    
    let linkStyle = {
        background: 'none',
        color: 'white',
        cursor: 'pointer',
        display: 'block',
        fontWeight: '900',
        fontSize: '30px',
        height: '70px',
        marginBottom: '15px',
        marginTop: '15px',
        position: 'relative',
        width: '70px'
    }
    
    let spanStyle = {
        bottom: 0,
        height: 'max-content', 
        left: 0,
        lineHeight: 1,
        margin: 'auto', 
        position: 'absolute', 
        right: 0,
        top: 0, 
        width: 'max-content', 
    }
    
    return(
        <div onClick = {() => history.push('/')} style = {linkStyle} className = 'NomoresheetLogo'>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#30363B" d="M42.3,-74.7C55.1,-65.8,66.1,-55.2,74.7,-42.4C83.2,-29.7,89.3,-14.8,89.7,0.2C90,15.2,84.6,30.5,74.3,40.2C64,49.8,48.7,54,35.6,62.1C22.4,70.2,11.2,82.3,-0.8,83.6C-12.7,84.9,-25.4,75.4,-36.1,65.9C-46.9,56.4,-55.6,46.8,-61.3,35.8C-66.9,24.8,-69.5,12.4,-72,-1.4C-74.5,-15.3,-76.9,-30.5,-70.9,-41C-64.9,-51.4,-50.6,-57.1,-37.4,-65.8C-24.2,-74.5,-12.1,-86.1,1.3,-88.4C14.7,-90.7,29.5,-83.6,42.3,-74.7Z" transform="translate(100 100)" />
            </svg>
            <span style = {spanStyle}>N</span>
        </div>
    );

}

export default NomoresheetLogo;