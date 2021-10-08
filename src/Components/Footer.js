import React, { useContext, useState } from 'react'
import { Link }                        from 'react-router-dom'
import Login                           from './Login'
import NewPost                         from './NewPost'
import UserContext                     from '../Functions/UserContext'
import '../Styles/Footer.css'

const Footer = () => {

    const [login, setLogin] = useState(false)
    const [post, setPost]   = useState(false)
    const { user }          = useContext(UserContext)
  
    return(
        <>
            <div className = 'Footer'>
                <div className = 'Wrap'>
                    <div className = 'Column'>
                        <p>© {(new Date()).getFullYear()} Nomoresheet</p>
                    </div>
                    <div className = 'Column'>
                        <Link to = {'/'}>Inicio</Link>
                        <Link to = {'/acerca'}>Acerca</Link>
                        <Link to = {'/estadisticas'}>Estadísticas</Link>
                        <Link to = {'/guias'}>Guías</Link>
                        <Link to = {'/privacidad'}>Privacidad</Link>
                        <a href = 'https://github.com/erikmartinjordan/nomoresheet' target = '_blank' rel = 'nofollow nooreferrer noopener'>Contribuye</a>
                    </div>
                </div>
            </div>
            <div className = 'DiscreteFooter'>
                <div className = 'Wrap'>
                    <div className = 'Row'>
                        <Link to = {'/'}>Inicio</Link>
                        { user
                        ? <div onClick = {() => setPost(true)}>Publicar</div>
                        : <div onClick = {() => setLogin(true)}>Acceder</div>
                        }
                        <Link to = {'/guias'}>Guías</Link>
                        <Link to = {'/privacidad'}>Privacidad</Link>
                        <a href = 'https://github.com/erikmartinjordan/nomoresheet' target = '_blank' rel = 'nofollow nooreferrer noopener'>Contribuye</a>
                    </div>
                    <div className = 'Info'>El modo discreto te muestra la información sin distracciones.</div>
                    <div className = 'Info'> Pulsa <kbd>{(navigator.userAgentData?.platform || navigator.platform).toLowerCase().includes('mac') ? '⌘' : 'ctrl'}</kbd> + <kbd>D</kbd> para volver al modo normal.</div>
                </div>
                { post  ? <NewPost hide = {() => setPost(false)}/>  : null }
                { login ? <Login   hide = {() => setLogin(false)}/> : null }
            </div>
        </>
    )
    
}

export default Footer