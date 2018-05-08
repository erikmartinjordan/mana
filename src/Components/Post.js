import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import firebase, { auth } from './Firebase';
import Default from './Default';
import Data from '../Posts/_data';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import '../Styles/Post.css';

class Post extends Component {
    
  constructor(){
      super();
      this.state = {
          error: false
      }
  }

  componentDidMount = () => { 
                  
      try{
          //1. Get .md post
          const readmePath = require('../Posts/' + this.props.match.params.string + '.md'); 
            
          fetch(readmePath).then(response => response.text()).then(text => this.setState({text: text}) );
          
          //2. Get info from Json
          let title         = Data[this.props.match.params.string].title;
          let date          = Data[this.props.match.params.string].date;
          let description   = Data[this.props.match.params.string].description;
          
          this.setState({ 
              title: title, 
              date: date, 
              description: description 
          });
          
          //3. Get infro from Views and Likes
          firebase.database().ref('articles/' + this.props.match.params.string).on('value', snapshot => {
                if(snapshot.val()){
                    this.setState({ 
                        views: snapshot.val().views,
                        likes: snapshot.val().likes,
                        superlikes: snapshot.val().superlikes,
                    })
                }
          })
          
          //4. Update counters 
          firebase.database().ref('articles/' + this.props.match.params.string + '/views/').transaction( value => value + 1 );
          
          //5. Add title and meta description
          document.title = title + ' - Erik Martín Jordán'; 
          document.querySelector('meta[name="description"]').content = description; 
      }
      catch(e){
          //md content doesn't exist
          this.setState({ error: true });
      }  
      

  }
  
  componentDidUpdate = () =>  Prism.highlightAll();
  handleLikes = () => firebase.database().ref('posts/' + this.props.match.params.string + '/likes/').transaction( value => value + 1 );
  handleSuperLikes = () => firebase.database().ref('posts/' + this.props.match.params.string + '/superlikes/').transaction( value => value + 1 );
  handleDislikes = () => firebase.database().ref('posts/' + this.props.match.params.string + '/dislikes/').transaction( value => value + 1 );

  render() {     
    return (
      <div className = 'Post'>
            {!this.state.error ? 
                [<div className = 'Header'>
                    <h1>{this.state.title ? this.state.title : null}</h1>
                    <div className = 'Infopost'>
                        <p className = 'Date'>{this.state.date  ? [this.state.date[1],', ',this.state.date[2]]  : null}</p>
                        <div className = 'i'>👀 {this.state.views ? this.state.views : null}</div>
                        <div className = 'i' onClick = {this.handleLikes}>👏 {this.state.likes ? this.state.likes : null}</div>
                        <div className = 'i' onClick = {this.handleSuperLikes}>🎉 {this.state.superlikes ? this.state.superlikes : null}</div>
                    </div>
                </div>,
                <div className = 'Content'>
                    {this.state.text ? <ReactMarkdown source = {this.state.text} renderers = {{link : props => <a href={props.href} target = '_blank' rel = 'noindex noreferrer noopener'>{props.children}</a>}}/> : null}
                </div>]
                :
                <Default></Default>
            }
      </div>
    );
  }
}

export default Post;
