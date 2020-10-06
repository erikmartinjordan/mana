import React, { useEffect }           from 'react';
import { Switch, Route, withRouter }  from 'react-router-dom';
import Forum                          from './Forum';
import Detail                         from './Detail';
import Post                           from './Post';
import Default                        from './Default';
import Blog                           from './Blog';
import Nav                            from './Nav';
import Footer                         from './Footer';
import Acerca                         from './Acerca';
import PublicInfo                     from './PublicInfo';
import Stats                          from './Stats';
import Privacy                        from './Privacy';
import Guidelines                     from './Guidelines';
import Helper                         from './Helper';
import DonateSuccess                  from './DonateSuccess';
import DonateFail                     from './DonateFail';
import TrafficStats                   from './TrafficStats';
import '../Styles/App.css';

const App  = () => {
    
    useEffect(() => {
        
        console.log(`
        
        ███╗   ██╗███╗   ███╗███████╗
        ████╗  ██║████╗ ████║██╔════╝
        ██╔██╗ ██║██╔████╔██║███████╗
        ██║╚██╗██║██║╚██╔╝██║╚════██║
        ██║ ╚████║██║ ╚═╝ ██║███████║
        ╚═╝  ╚═══╝╚═╝     ╚═╝╚══════╝ 
        
        Creado desde Barcelona.
        © ${(new Date().getFullYear())}, Erik Martín Jordán. 
        
        `);
        
    }, []);
   
    return (
        <React.Fragment>
            <TrafficStats/>
            <Helper/>
            <div className = 'Title-Menu'>
                <Switch key = 'A'>
                    <Route                                     component = {Nav}/>
                 </Switch>
                <Switch  key = 'B'>
                    <Route exact path = '/'                    component = {Forum}/>
                    <Route exact path = '/blog'                component = {Blog}/>
                    <Route exact path = '/acerca'              component = {Acerca}/>
                    <Route exact path = '/estadisticas'        component = {Stats}/>
                    <Route exact path = '/privacidad'          component = {Privacy}/>
                    <Route exact path = '/guias'               component = {Guidelines}/>
                    <Route exact path = '/donateSuccess'       component = {DonateSuccess}/>
                    <Route exact path = '/donationFail'        component = {DonateFail}/>
                    <Route path = '/comunidad/post/:string'    component = {Detail}/>
                    <Route path = '/tag/:string'               component = {Forum}/>
                    <Route path = '/@:string'                  component = {PublicInfo}/>
                    <Route path = '/:string'                   component = {Post}/>
                    <Route                                     component = {Default}/>
                </Switch>
            </div>
            <Switch key = 'C'>
                <Route                                         component = {Footer}/>
            </Switch>
        </React.Fragment>
    );

}

export default withRouter(App);