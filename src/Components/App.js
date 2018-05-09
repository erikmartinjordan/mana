import React, { Component } from 'react';
import { Switch, Route }    from 'react-router-dom';
import Perfil               from './Perfil';
import Calc                 from './Calc';
import Temp                 from './Temp';
import Divisas              from './Div';
import Forum                from './Forum/Front';
import ForumDetail          from './Forum/Detail';
import Post                 from './Post';
import Default              from './Default';
import Blog                 from './Blog';
import Nav                  from './Nav';
import Footer               from './Footer';

class App extends Component {
  render() {    
    return (
        [<Switch key = 'A'>
            <Route                                     component = {Nav}/>
         </Switch>,
        <Switch  key = 'B'>
            <Route exact path = '/'                    component = {Forum}/>
            <Route exact path = '/perfil'              component = {Perfil}/>
            <Route exact path = '/calculadora'         component = {Calc}/>
            <Route exact path = '/divisas'             component = {Divisas}/>
            <Route exact path = '/temperatura'         component = {Temp}/>
            <Route exact path = '/blog'                component = {Blog}/>
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
