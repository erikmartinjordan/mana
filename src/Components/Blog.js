import React, { Component } from 'react';
import {auth, provider} from '../Functions/Firebase.js';
import Data from '../Posts/_data.js';
import { Link } from 'react-router-dom';
import Login from './Login.js';
import '../Styles/Blog.css';


class Blog extends Component {

  state = {
      archive: [],
      login: false,
      user: null
  }

  showBanner = (privat) => (e) => {
            
      // Is user logged in?
      if(!this.state.user && privat) {
          
          // Prevent redirection to the new page
          e.preventDefault();
          
          // Showing the banner
          this.setState({ login: true });
      }
      
  }
  
  hideBanner = () => this.setState({ login: false });
    
  componentDidMount = () => {
      
      let first = true;
      let length = Object.keys(Data).length;
      let year;
      let array = [];
      let posts = [];
      let i = 0;
      let privat = false;
            
      // Is user authenticated?
      auth.onAuthStateChanged( user => this.setState({ user: user }) );
            
      for (var key in Data) {
          
          
          i ++;
          
          if(first){
              year = Data[key].date[2];
              first = false;
          }
          
          if(Data[key].date[2] !== year){
                            
              array.push([<h2 key = {key} className = 'Year'>{year}</h2>, <div className = 'Block'>{posts}</div>]);
              year  = Data[key].date[2];
              posts = [];
              
          }
          
          // If privat is undefined, show article to the user
          privat = Data[key].privat ? true : false;
        
          // Inserting all the posts, if it's restricted and user is not logged in, we blocked it
          let article = <article key = {key + 1}>
                        <div className = 'Title-Date'>
                            <Link onClick = {this.showBanner(privat)} to = {'/' + key}>{Data[key].title}</Link>
                            <p className = 'Day-Month-Year'>{Data[key].date[0]} de {Data[key].date[1]} del {Data[key].date[2]}</p>
                        </div>
                        <div className = 'Access'>
                            {Data[key].privat && <p>🔒</p>}
                        </div>
                     </article>;
                             
          posts.push(article);
                     
          if(i === length){
              array.push([<h2 key = {key} className = 'Year'>{year}</h2>, <div className = 'Block'>{posts}</div>]);
          }
                                                                                    
                     
      }                                    
      this.setState({ archive: array });
      
      
      //Metas and titles
      document.title = 'Blog - Nomoresheet'; 
      document.querySelector('meta[name="description"]').content = 'Artículos sobre Sudeste Asiático, especialmente sobre Tailandia y demás cosas que puedan resultar interesantes.'; 
      
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  }
  
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
            
  render() {        
                                                    
    return (
      <div className = 'Blog'>
            <h2>Blog</h2>
            <div style = {{textAlign: 'center'}}>El archivo contiene una colección de {Object.keys(Data).length} artículos. ☕</div>
            {this.state.archive}
            {this.state.login && <Login hide = {this.hideBanner}></Login>}
      </div>
    );
  }
}

export default Blog;
