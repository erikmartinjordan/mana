import React, { useEffect, useState }     from 'react'
import { Switch, Route, withRouter }      from 'react-router-dom'
import Forum                              from './Forum'
import Detail                             from './Detail'
import Default                            from './Default'
import Nav                                from './Nav'
import Footer                             from './Footer'
import Acerca                             from './Acerca'
import PublicInfo                         from './PublicInfo'
import Stats                              from './Stats'
import Privacy                            from './Privacy'
import Guidelines                         from './Guidelines'
import Helper                             from './Helper'
import DonateSuccess                      from './DonateSuccess'
import DonateFail                         from './DonateFail'
import TrafficStats                       from './TrafficStats'
import Tags                               from './Tags'
import Users                              from './Users'
import Verify                             from './Verify'
import UserContext                        from '../Functions/UserContext'
import { onAuthStateChanged, auth }       from '../Functions/Firebase'
import FetchAdmin                         from '../Functions/FetchAdmin'
import '../Styles/App.css'

console.log(`

███╗   ██╗███╗   ███╗███████╗
████╗  ██║████╗ ████║██╔════╝
██╔██╗ ██║██╔████╔██║███████╗
██║╚██╗██║██║╚██╔╝██║╚════██║
██║ ╚████║██║ ╚═╝ ██║███████║
╚═╝  ╚═══╝╚═╝     ╚═╝╚══════╝ 

Creado desde Barcelona.
© 2015 – ${(new Date().getFullYear())}, Erik Martín Jordán. 

`)

const App  = () => {
    
    const [user, setUser]   = useState(null)
    const [admin, setAdmin] = useState(null)
    
    useEffect(() => {
        
        onAuthStateChanged(auth, async user => {
            
            if(user){
                
                setUser(user)    
                setAdmin(await FetchAdmin(user))
                
            }
            else{
                
                setUser(false)
                setAdmin(false)
                
            }
            
        })
        
    }, [])
   
    return (
        <UserContext.Provider value = {{admin, user}}>
            <TrafficStats/>
            <Helper/>
            <div className = 'Title-Menu'>
                <Switch key = 'A'>
                    <Route                                     component = {Nav}/>
                 </Switch>
                <Switch  key = 'B'>
                    <Route exact path = '/'                    component = {Forum}/>
                    <Route exact path = '/acerca'              component = {Acerca}/>
                    <Route exact path = '/estadisticas'        component = {Stats}/>
                    <Route exact path = '/privacidad'          component = {Privacy}/>
                    <Route exact path = '/guias'               component = {Guidelines}/>
                    <Route exact path = '/donateSuccess'       component = {DonateSuccess}/>
                    <Route exact path = '/donationFail'        component = {DonateFail}/>
                    <Route exact path = '/tags'                component = {Tags}/>
                    <Route exact path = '/usuarios'            component = {Users}/>
                    <Route path = '/v/:string'                 component = {Verify}/>
                    <Route path = '/comunidad/post/:string'    component = {Detail}/>
                    <Route path = '/tag/:string'               component = {Forum}/>
                    <Route path = '/@:string'                  component = {PublicInfo}/>
                    <Route                                     component = {Default}/>
                </Switch>
            </div>
            <Switch key = 'C'>
                <Route                                         component = {Footer}/>
            </Switch>
        </UserContext.Provider>
    )
    
}

export default withRouter(App)