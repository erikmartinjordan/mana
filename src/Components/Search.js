import React, { Component } from 'react';
import Data from '../Posts/_data';
import '../Styles/Search.css'

class Search extends Component {
    
  constructor(){
      super();
      this.state = {
          result: []
      }
  }
      
  handleSearch = (e) => {
      let query = e.target.value;      
      
      let array_url_title_descr = Object.keys(Data).map( key => [key, Data[key].title, Data[key].description] );
      
      let filter = array_url_title_descr.filter( array =>
          array[1].toLowerCase().indexOf(query) !== -1 || 
          array[2].toLowerCase().indexOf(query) !== -1
      );
      
      let result = filter.map(array => <li><a href = {'/' + array[0]}>{array[1]}</a></li>);
                                    
      this.setState({ result: result });
  }
  
  render() {            
    return (
      <div className = 'Search'>
            <div className = 'Search-Wrap'>
                <input onChange = {this.handleSearch} placeholder = 'Buscar...'></input>
                    { this.state.result.length > 0 
                    ? <div className = 'Results'><ul>{this.state.result}</ul></div>
                    : null
                    }
            </div>
      </div>
    );
  }
}

export default Search;
