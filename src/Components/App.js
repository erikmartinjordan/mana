import React, { useEffect, useState } from 'react';
import ReactGA                        from 'react-ga';
import { Switch, Route, withRouter }  from 'react-router-dom';
import firebase                       from '../Functions/Firebase';
import Fingerprint                    from 'fingerprintjs';
import Forum                          from './Forum';
import Detail                         from './Detail';
import Post                           from './Post';
import Default                        from './Default';
import Blog                           from './Blog';
import Nav                            from './Nav';
import Footer                         from './Footer';
import Acerca                         from './Acerca';
import PublicInfo                     from './PublicInfo';
import Estadisticas                   from './Estadisticas';
import '../Styles/App.css';

ReactGA.initialize('UA-87406650-1');

const App  = ({history}) => {
    
    const [branchKey, setBranchKey] = useState(null);
    
    let fingerprint = new Fingerprint().get();

    let date  = new Date();
    let day   = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year  = date.getFullYear();
    
    useEffect( () => {
        
        let ref = firebase.database().ref(`analytics/${year}${month}${day}/${fingerprint}`);
        
        let branch = ref.push({
            
            timeStampIni: date.getTime(),
            timeStampEnd: date.getTime()
            
        });
            
        ref.child(`${branch.key}/pageviews`).push({ url: history.location.pathname });
        
        window.addEventListener('scroll', () => {
            
            ref.child(`${branch.key}/timeStampEnd`).transaction( value => (new Date()).getTime() );
            
        });
        
        setBranchKey(branch.key);
        
    }, []);
    
    useEffect( () => {
        
        if(branchKey){
            
            let ref = firebase.database().ref(`analytics/${year}${month}${day}/${fingerprint}/${branchKey}/pageviews`);
            
            ref.push({ url: history.location.pathname });
            
        }
        
    }, [history.location.pathname]);
    
    useEffect( () => {
        
        ReactGA.pageview(window.location.pathname + window.location.search); 
        
    }, []);
   
    return (
        <React.Fragment>
            <div className = 'Title-Menu'>
                <Switch key = 'A'>
                    <Route                                     component = {Nav}/>
                 </Switch>
                <Switch  key = 'B'>
                    <Route exact path = '/'                    component = {Forum}/>
                    <Route exact path = '/blog'                component = {Blog}/>
                    <Route exact path = '/acerca'              component = {Acerca}/>
                    <Route exact path = '/estadisticas'        component = {Estadisticas}/>
                    <Route path = '/comunidad/post/:string'    component = {Detail}/>
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
