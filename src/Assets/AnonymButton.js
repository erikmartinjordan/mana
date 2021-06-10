import React from 'react';

const AnonymButton = ({logIn}) => {
    
    const buttonStyle = {
        
        alignItems: 'center',
        background: 'black',
        color: 'white',
        display: 'flex',
        height: '30px',
        margin: '5px',
        whiteSpace: 'nowrap',
        width: '200px'
        
    }
    
    const svgStyle = {
        
        fill: 'var(--blue)',
        height: '20px',
        width: '20px',
        marginRight: '5px'
        
    }
    
    return(
        <button style = {buttonStyle} onClick = {logIn}>
            <svg style = {svgStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fillRule="evenodd" d="M0 8a8 8 0 1116 0v5.25a.75.75 0 01-1.5 0V8a6.5 6.5 0 10-13 0v5.25a.75.75 0 01-1.5 0V8zm5.5 4.25a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zM3 6.75C3 5.784 3.784 5 4.75 5h6.5c.966 0 1.75.784 1.75 1.75v1.5A1.75 1.75 0 0111.25 10h-6.5A1.75 1.75 0 013 8.25v-1.5zm1.47-.53a.75.75 0 011.06 0l.97.97.97-.97a.75.75 0 011.06 0l.97.97.97-.97a.75.75 0 111.06 1.06l-1.5 1.5a.75.75 0 01-1.06 0L8 7.81l-.97.97a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 010-1.06z"></path></svg>
            <span>Accede de incógnito</span>
        </button>
    );
    
}


export default AnonymButton;