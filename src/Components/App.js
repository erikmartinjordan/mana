import React, { Component } from 'react';
import { Switch, Route }    from 'react-router-dom';
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
            <Route path = '/comunidad/post/:string'    component = {ForumDetail}/>
            <Route exact path = '/blog'                component = {Blog}/>
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
