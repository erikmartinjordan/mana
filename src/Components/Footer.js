import React, { useEffect } from 'react';
import { Link }             from 'react-router-dom';
import '../Styles/Footer.css';

const Footer = () => {
  
    return (
      <div className = 'Footer'>
        <div className = 'Wrap'>
            <div className = 'Column'>
                <p>© {(new Date()).getFullYear()} Nomoresheet</p>
            </div>
            <div className = 'Column'>
                <Link to = {'/'}>Comunidad</Link>
                <Link to = {'/blog'}>Blog</Link>
                <Link to = {'/acerca'}>Acerca</Link>
                <Link to = {'/estadisticas'}>Estadísticas</Link>
            </div>
            <div className = 'Column'>
                <Link to = {'/guias'}>Guías de publicación</Link>
                <Link to = {'/privacidad'}>Privacidad</Link>
            </div>
        </div>
      </div>
    );
    
}

export default Footer;