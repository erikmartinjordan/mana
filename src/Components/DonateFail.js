import React, { useEffect } from 'react';
import '../Styles/Default.css';

const DonateFail = () => {
    
    return (
        <div className = 'Default'>
            <h2>Ups...</h2>
            <img src = 'https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif' alt = {'Donate Failure'}></img>
            <p>Algo ha ido mal en el proceso de donación... Vuelve a intentarlo más tarde o escribe un mensaje en la comunidad y miramos qué ha pasado.</p>
        </div>
    );
}

export default DonateFail;
