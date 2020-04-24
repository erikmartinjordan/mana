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
import Stats                          from './Stats';
import '../Styles/App.css';

ReactGA.initialize('UA-87406650-1');

const App  = ({history}) => {
    
    const [branchKey, setBranchKey] = useState(null);
    
    let fingerprint = new Fingerprint().get();

    let date  = new Date();
    let day   = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year  = date.getFullYear();
    
    let ref = firebase.database().ref(`analytics/${year}${month}${day}/${fingerprint}`);
    
    useEffect( () => {
        
        let branch = ref.push({
            
            timeStampIni: date.getTime(),
            timeStampEnd: date.getTime()
            
        });
            
        ref.child(`${branch.key}/pageviews`).push({ url: history.location.pathname });
        
        setBranchKey(branch.key);
        
    }, []);
    
    useEffect( () => {
        
        if(branchKey){
            
            ref.child(`${fingerprint}/${branchKey}/pageviews`).push({ url: history.location.pathname });
            
        }
        
    }, [history.location.pathname]);
    
    useEffect( () => {
        
        let scrollListener;
        
        if(branchKey && history.location.pathname !== '/estadisticas'){
            
            scrollListener = window.addEventListener('scroll', () => {
            
                ref.child(`${branchKey}/timeStampEnd`).transaction( value => (new Date()).getTime() );
            
            });
        }
        
        return () => window.removeEventListener('scroll', scrollListener); 
        
    }, [branchKey, history.location.pathname]);
    
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
                    <Route exact path = '/estadisticas'        component = {Stats}/>
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
