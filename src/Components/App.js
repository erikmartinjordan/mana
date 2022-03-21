import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Switch, Route, withRouter }                  from 'react-router-dom'
import UserContext                                    from '../Functions/UserContext'
import { onAuthStateChanged, auth }                   from '../Functions/Firebase'
import FetchAdmin                                     from '../Functions/FetchAdmin'
const Forum         = lazy(() => import('./Forum'))
const Detail        = lazy(() => import('./Detail'))
const Default       = lazy(() => import('./Default'))
const Nav           = lazy(() => import('./Nav'))
const Footer        = lazy(() => import('./Footer'))
const Acerca        = lazy(() => import('./Acerca'))
const PublicInfo    = lazy(() => import('./PublicInfo'))
const Stats         = lazy(() => import('./Stats'))
const Privacy       = lazy(() => import('./Privacy'))
const Guidelines    = lazy(() => import('./Guidelines'))
const Helper        = lazy(() => import('./Helper'))
const DonateSuccess = lazy(() => import('./DonateSuccess'))
const DonateFail    = lazy(() => import('./DonateFail'))
const TrafficStats  = lazy(() => import('./TrafficStats'))
const Tags          = lazy(() => import('./Tags'))
const Users         = lazy(() => import('./Users'))
const Verify        = lazy(() => import('./Verify'))
import '../Styles/App.css'

console.log(`   

██████████╗

███╗   ███╗
████╗ ████║
██╔████╔██║
██║╚██╔╝██║
██║ ╚═╝ ██║
╚═╝     ╚═╝      

Creado desde Barcelona.
© 2015 – ${(new Date().getFullYear())}, Erik Martín Jordán. 

`)

const App  = () => {
    
    const [user, setUser]   = useState(null)
    const [admin, setAdmin] = useState(null)

    useEffect(() => {
        
        onAuthStateChanged(auth, async user => {

            setUser(user)
            setAdmin(await FetchAdmin(user))
            
        })
        
    }, [])
   
    return (
        <UserContext.Provider value = {{admin, user}}>
            <Suspense fallback = {<div></div>}>
                <TrafficStats/>
                <Helper/>
            </Suspense>
            <div className = 'Title-Menu'>
                <Suspense fallback = {<div></div>}>
                    <Switch key = 'A'>
                        <Route                                     component = {Nav}/>
                    </Switch>
                </Suspense>
                <Suspense fallback = {<div></div>}>
                    <Switch  key = 'B'>
                        <Route exact path = '/'                    component = {Forum}/>
                        <Route exact path = '/acerca'              component = {Acerca}/>
                        <Route exact path = '/estadisticas'        component = {Stats}/>
                        <Route exact path = '/privacidad'          component = {Privacy}/>
                        <Route exact path = '/guias'               component = {Guidelines}/>
                        <Route exact path = '/donateSuccess'       component = {DonateSuccess}/>
                        <Route exact path = '/donationFail'        component = {DonateFail}/>
                        <Route exact path = '/t'                   component = {Tags}/>
                        <Route exact path = '/u'                   component = {Users}/>
                        <Route path = '/v/:string'                 component = {Verify}/>
                        <Route path = '/p/:string'                 component = {Detail}/>
                        <Route path = '/t/:string'                 component = {Forum}/>
                        <Route path = '/@:string'                  component = {PublicInfo}/>
                        <Route                                     component = {Default}/>
                    </Switch>
                </Suspense>
            </div>
            <Suspense fallback = {<div></div>}>
                <Switch key = 'C'>
                    <Route                                         component = {Footer}/>
                </Switch>
            </Suspense>
        </UserContext.Provider>
    )
    
}

export default withRouter(App)