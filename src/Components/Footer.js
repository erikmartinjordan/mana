import React    from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Footer.css'

const Footer = () => {
  
    return(
        <div className = 'Footer'>
            <div className = 'Wrap'>
                <div className = 'Column'>
                    <p>© {(new Date()).getFullYear()} Maña</p>
                </div>
                <div className = 'Column'>
                    <Link to = {'/'}>Inicio</Link>
                    <Link to = {'/acerca'}>Acerca</Link>
                    <Link to = {'/estadisticas'}>Estadísticas</Link>
                    <Link to = {'/guias'}>Guías</Link>
                    <Link to = {'/privacidad'}>Privacidad</Link>
                    <a href = 'https://github.com/erikmartinjordan/mana' target = '_blank' rel = 'nofollow nooreferrer noopener'>Contribuye</a>
                </div>
            </div>
        </div>
    )
    
}

export default Footer