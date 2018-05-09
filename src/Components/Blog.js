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
      let year;
      let array = [];
      
      for (var key in Data) {
          
          if(first || Data[key].date[2] !== year){
              year  = Data[key].date[2];
              first = false;
              array.push(<h2 key = {key} className = 'Year'>{year}</h2>);
          }
            
          array.push(<article key = {key + 1}>
                        <Link to = {'/' + key}>{Data[key].title}</Link>
                        <p key = {key + 2} className = 'Month'>{Data[key].date[1]}</p>
                     </article>);
      }                                    
      this.setState({ archive: array });
  }
            
  render() {        
                                                    
    return (
      <div className = 'Blog'>
            {this.state.archive ? this.state.archive : null}
      </div>
    );
  }
}

export default Blog;
