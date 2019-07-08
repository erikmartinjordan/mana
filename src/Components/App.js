import React, { Component } from 'react';
import ReactGA              from 'react-ga';
import { Switch, Route }    from 'react-router-dom';
import Perfil               from './Perfil';
import Forum                from './Forum';
import ForumDetail          from './Detail';
import Post                 from './Post';
import Default              from './Default';
import Blog                 from './Blog';
import Nav                  from './Nav';
import Footer               from './Footer';
import Acerca               from './Acerca';

ReactGA.initialize('UA-87406650-1');

class App extends Component {
    
  componentDidMount  = () => ReactGA.pageview(window.location.pathname + window.location.search); 
  componentDidUpdate = () => ReactGA.pageview(window.location.pathname + window.location.search);

  render() {    
    return (
        [<Switch key = 'A'>
            <Route                                     component = {Nav}/>
         </Switch>,
        <Switch  key = 'B'>
            <Route exact path = '/'                    component = {Forum}/>
            <Route exact path = '/perfil'              component = {Perfil}/>
            <Route exact path = '/blog'                component = {Blog}/>
            <Route exact path = '/acerca'              component = {Acerca}/>
            <Route path = '/comunidad/post/:string'    component = {ForumDetail}/>
            <Route path = '/:string'                   component = {Post}/>
            <Route                                     component = {Default}/>
        </Switch>,
        <Switch key = 'C'>
            <Route                                     component = {Footer}/>
        </Switch>
        ]
    );
  }
}

export default App;
