import React, { useEffect } from 'react'
import '../Styles/Default.css'

const DonateSuccess = () => {
    
    useEffect(() => {
        
        let meta = document.createElement('meta'); 
        meta.name = 'robots'; 
        meta.content = 'noindex, nofollow';
        document.querySelector('meta[name="description"]').after(meta);
        
    }, [])
    
    return (
        <div className = 'Default'>
            <h2>¡Gracias!</h2>
            <img src = 'https://media2.giphy.com/media/3oFzlVRupsRi40wfOE/giphy.gif' alt = {'Donate Success'}></img>
            <p>Gracias por tu aportación; el usuario ya ha recibido tu donación.</p>
        </div>
    )
}

export default DonateSuccess
