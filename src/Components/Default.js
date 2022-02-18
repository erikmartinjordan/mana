import React, { useEffect } from 'react'
import { Link }             from 'react-router-dom'
import '../Styles/Default.css';

const Default = () => {
    
    useEffect(() => {
        
        let meta = document.createElement('meta'); 
        meta.name = 'robots'; 
        meta.content = 'noindex, nofollow';
        document.querySelector('meta[name="description"]').after(meta);
        
    }, [])
    
    return (
        <div className = 'Default'>
            <h2>Ups...</h2>
            <img src = 'https://media.giphy.com/media/fCsBD0QEK3YGs/giphy.gif' alt = {'Elon Musk smoking'}></img>
            <p>Creo que la página que buscas se ha ido a por tabaco. Hay varias opciones posibles:</p>
            <ul>
                <li>Puedes comentar a través del foro haciendo clic <Link to = '/'>aquí</Link>.</li>
                <li>O puedes ver el archivo de entradas haciendo clic <Link to = '/blog'>aquí</Link>.</li>
                <li>O puedes quedarte viendo esta página.</li>
            </ul>
        </div>
    )
}

export default Default