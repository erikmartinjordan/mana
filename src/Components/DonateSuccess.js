import React, { useEffect } from 'react';
import '../Styles/Default.css';

const DonateSuccess = () => {
    
    return (
        <div className = 'Default'>
            <h2>¡Gracias!</h2>
            <img src = 'https://media2.giphy.com/media/3oFzlVRupsRi40wfOE/giphy.gif' alt = {'Donate Success'}></img>
            <p>Gracias por tu aportación; el usuario ya ha recibido tu donación.</p>
        </div>
    );
}

export default DonateSuccess;
