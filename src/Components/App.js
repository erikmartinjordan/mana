import React, {useEffect}   from 'react';
import ReactGA              from 'react-ga';
import { Switch, Route }    from 'react-router-dom';
import firebase             from '../Functions/Firebase';
import Fingerprint          from 'fingerprintjs';
import Perfil               from './Perfil';
import Forum                from './Forum';
import Detail               from './Detail';
import Post                 from './Post';
import Default              from './Default';
import Blog                 from './Blog';
import Nav                  from './Nav';
import Footer               from './Footer';
import Acerca               from './Acerca';
import PublicInfo           from './PublicInfo';

ReactGA.initialize('UA-87406650-1');

const App  = () => {
        
    useEffect( () => {

        // Declaring and getting fingerprint from the user
        let fingerprint = new Fingerprint().get();

        // Declaring date and make it dd/mm/yyyy
        let date = new Date();
        let day = ('0' + date.getDate()).slice(-2);
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();

        // Adding stat of visits to database
        firebase.database().ref('stats/' + `/${year}${month}${day}/` + `/${fingerprint}` + '/visits/' ).transaction( value => value + 1 );

        // Adding stat to Google Analytics
        ReactGA.pageview(window.location.pathname + window.location.search); 

    });
   
    return (
        [<Switch key = 'A'>
            <Route                                     component = {Nav}/>
         </Switch>,
        <Switch  key = 'B'>
            <Route exact path = '/'                    component = {Forum}/>
            <Route exact path = '/perfil'              component = {Perfil}/>
            <Route exact path = '/blog'                component = {Blog}/>
            <Route exact path = '/acerca'              component = {Acerca}/>
            <Route path = '/comunidad/post/:string'    component = {Detail}/>
            <Route path = '/@:string'                  component = {PublicInfo}/>
            <Route path = '/:string'                   component = {Post}/>
            <Route                                     component = {Default}/>
        </Switch>,
        <Switch key = 'C'>
            <Route                                     component = {Footer}/>
        </Switch>
        ]
    );
}

export default App;
