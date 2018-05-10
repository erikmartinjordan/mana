import React, { Component } from 'react';
import Data from '../Posts/_data.js';
import { Link } from 'react-router-dom';
import '../Styles/Blog.css';


class Blog extends Component {

  constructor(){
      super();
      this.state = {
          archive: []
      }
  }
    
  componentDidMount = () => {
      
      let first = true;
      let length = Object.keys(Data).length;
      let year;
      let array = [];
      let posts = [];
      let i = 0;
      
      
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
        
          posts.push(<article key = {key + 1}>
                        <Link to = {'/' + key}>{Data[key].title}</Link>
                        <p key = {key + 2} className = 'Month'>{Data[key].date[1]}</p>
                     </article>);
                     
          if(i === length){
              array.push([<h2 key = {key} className = 'Year'>{year}</h2>, <div className = 'Block'>{posts}</div>]);
          }
                                                                                    
                     
      }                                    
      this.setState({ archive: array });
  }
            
  render() {        
                                                    
    return (
      <div className = 'Blog'>
            <h2>Blog</h2>
            <div style = {{textAlign: 'center'}}>El archivo contiene una colección de {Object.keys(Data).length} artículos. </div>
            <div style = {{textAlign: 'center'}}>Puedes comentar a través del <Link to = '/'>foro</Link>. ☕</div>
            {this.state.archive ? this.state.archive : null}
      </div>
    );
  }
}

export default Blog;
