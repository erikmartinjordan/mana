import React, { lazy, Suspense, useContext, useState, useEffect }                 from 'react'
import { Link }                                                                   from 'react-router-dom'
import { ArrowRightIcon, HomeIcon, NumberIcon, TelescopeIcon, PaperAirplaneIcon } from '@primer/octicons-react'
import UserAvatar                                                                 from './UserAvatar'
import NightModeToggleButton                                                      from './NightModeToggleButton'
import NomoresheetLogo                                                            from './NomoresheetLogo'
import UnreadNotifications                                                        from './UnreadNotifications'
import { db, onValue, ref }                                                       from '../Functions/Firebase'
import GetLevel                                                                   from '../Functions/GetLevelAndPointsToNextLevel'
import UserContext                                                                from '../Functions/UserContext'
const Login   = lazy(() => import('./Login'))
const Profile = lazy(() => import('./Profile'))
const NewPost = lazy(() => import('./NewPost'))
import '../Styles/Nav.css'

const Nav = () => {
    
    const [post, setPost]             = useState(false)
    const [login, setLogin]           = useState(false)
    const [perfil, setPerfil]         = useState(false)
    const [uid, setUid]               = useState(null)
    const [userInfo, setUserInfo]     = useState(null)
    const { user }                    = useContext(UserContext)
    const level                       = GetLevel(uid)[0]                    

    useEffect (() => {
      
        if(user){
            
            let unsubscribe = onValue(ref(db, `users/${user.uid}`), snapshot => {

                setUserInfo(snapshot.val() || null)
                setUid(user.uid)

            })

            return () => unsubscribe()
            
        }
      
    }, [user])
    
    useEffect(() => {
        
        let currentUrl = window.location.href
        
        if(user && currentUrl.includes('?'))
            setPerfil(true)
        
    }, [user])
  
    const menuNotUser = () => {
      
        return(
            <div className = 'Menu' key = 'b'>
                <Link to = '/'><HomeIcon/>Inicio</Link>
                <Link to = '/tags'><NumberIcon/>Temas</Link>
                <Link to = '/usuarios'><TelescopeIcon/>Descubre</Link>
                <NightModeToggleButton/>
                <div className = 'Access'>
                    <span className = 'Title'>¡Únete a la comunidad!</span>
                    <p>Publica sin censura y consigue reputación compartiendo tu saber hacer con otros usuarios.</p>
                    <div className = 'Decide'>
                        <button onClick = {() => setLogin(true)}>Acceder</button>
                        <Link to = '/acerca'>o saber más <ArrowRightIcon/></Link>
                    </div>
                </div>
            </div>
        )  
    }
  
    const menuUser = () => {
      
        return(      
            <div className = 'Menu' key = 'a'>
                <div onClick = {() => setPerfil(true)} className = 'Img-Wrap'>
                    <UserAvatar user = {user} allowAnonymousUser = {true}/>
                    <div className = 'Name-Points'>
                        <span className = 'Name'>
                            {userInfo?.nickName || user?.displayName}
                        </span>
                        <span className = 'Points'>Nivel {level} <UnreadNotifications user = {user}/></span>
                    </div>
                </div>
                <div className = 'Separator'></div>
                <Link to = '/'><HomeIcon/>Inicio</Link>
                <Link to = '/tags'><NumberIcon/>Temas</Link>
                <Link to = '/usuarios'><TelescopeIcon/>Descubre</Link>
                <div className = 'Separator'></div>
                <NightModeToggleButton/>
                <div className = 'Separator'></div>
                <button to = '/' onClick = {() => setPost(true)}>Publicar</button>
            </div>
        )

    }


    const menuMobile = () => {

        return(      
            <div className = 'Mobile' key = 'c'>
                <Link to = '/'><HomeIcon/>Inicio</Link>
                <Link to = '/tags'><NumberIcon/>Temas</Link>
                <Link to = '/usuarios'><TelescopeIcon/>Descubre</Link>
                <Link to = '/' onClick = {() => setPost(true)}><PaperAirplaneIcon/>Publicar</Link>
                <div onClick = {() => setPerfil(true)} className = 'Img-Wrap'>
                    <UserAvatar user = {user} allowAnonymousUser = {true}/>
                    <UnreadNotifications user = {user}/>
                </div>
            </div>
        )

    }

    const loginButton = () => <button key = 'd' className = 'login' onClick = {() => setLogin(true)}>Acceder</button>
    
    return(
        <div className = 'Nav'>
            <NomoresheetLogo/>
            {user   ? [menuUser(), menuMobile()] : [loginButton(), menuNotUser()]}
            { login
            ? <Suspense fallback = {<div></div>}>
                <Login hide = {() => setLogin(false)}/>
              </Suspense>
            : null
            }
            { perfil
            ? <Suspense fallback = {<div></div>}>
                <Profile hide = {() => setPerfil(false)}/>
              </Suspense>
            : null
            }
            { post
            ? <Suspense fallback = {<div></div>}>
                <NewPost hide = {() => setPost(false)}/>
              </Suspense>
            : null
            }
        </div>
    )
}

export default Nav