import React, { Component } from 'react';
import Data from '../Posts/_data';
import '../Styles/Search.css'

class Search extends Component {
    
  constructor(){
      super();
      this.state = {
          invisible: false,
          result: []
      }
  }
      
  handleSearch = (e) => {
      
      // Value to search
      let query = e.target.value;      
      
      // Array[0] = URL, Array [1] = title, Array[2] = Desc
      let array_url_title_descr = Object.keys(Data).map( key => [key, Data[key].title, Data[key].description] );
      
      // Filter title or description
      let filter = array_url_title_descr.filter( array =>
          array[1].toLowerCase().indexOf(query) !== -1 || 
          array[2].toLowerCase().indexOf(query) !== -1
      );
      
      //Return array of results
      let result = filter.map(array => <li><a href = {'/' + array[0]}>{array[1]}</a></li>);
                                    
      this.setState({ 
          result: result,
          show: true
      });
  }
  
  displayInvisible = () => this.setState({ invisible: true });
  hideInvisible    = () => this.setState({ invisible: false });
 
  render() {            
    return (
      <div className = 'Search'>
            { this.state.invisible ? <div onClick = {this.hideInvisible} className = 'Invisible'></div> : null}
            <div className = 'Search-Wrap'>
                <input onClick = {this.displayInvisible} onChange = {this.handleSearch} placeholder = 'Buscar...'></input>
                    { this.state.result.length > 0  && this.state.invisible
                    ? <div className = 'Results'><ul>{this.state.result}</ul></div>
                    : null
                    }
            </div>
      </div>
    );
  }
}

export default Search;
