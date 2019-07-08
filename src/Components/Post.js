import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import firebase, { auth } from '../Functions/Firebase';
import Default from './Default';
import Login from './Login';
import Data from '../Posts/_data';
import '../Styles/Post.css';

class Post extends Component {
    
  constructor(){
      super();
      this.state = {
          error: false,
          relatedContent: [],
          render: false
      }
  }

  componentDidMount = () => { 
      
      auth.onAuthStateChanged( user => this.setState({ user: user }) );
                  
      try{
          // Get .md post
          const readmePath = require('../Posts/' + this.props.match.params.string + '.md'); 
          
          // Fecth response and load Instagram and Twitter scripts
          fetch(readmePath).then(response => response.text()).then(text => this.setState({text: text}) ).then( () => {
              if(window.instgrm) window.instgrm.Embeds.process();
              if(window.twttr) window.twttr.widgets.load();
          });
          
          // Get info from Json
          let title         = Data[this.props.match.params.string].title;
          let date          = Data[this.props.match.params.string].date;
          let description   = Data[this.props.match.params.string].description;
          
          this.setState({ 
              title: title, 
              date: date, 
              description: description 
          });
          
          // Get infro from Views and Likes
          firebase.database().ref('articles/' + this.props.match.params.string).on('value', snapshot => {
                if(snapshot.val()){
                    this.setState({ 
                        views: snapshot.val().views,
                        likes: snapshot.val().likes,
                        superlikes: snapshot.val().superlikes,
                    })
                }
          })
          
          // Update counters 
          firebase.database().ref('articles/' + this.props.match.params.string + '/views/').transaction( value => value + 1 );
          
          // Add title and meta description
          document.title = title + ' - Nomoresheet'; 
          document.querySelector('meta[name="description"]').content = description; 
          
          // Look for related posts
          this.relatedContent();
          
          window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
          
      }
      catch(e){
          // Md content doesn't exist
          this.setState({ error: true });
      }  
      

  }
  
  componentDidUpdate    = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  
  showBanner            = () => this.setState({render: true}); 
  hideBanner            = () => this.setState({render: false}); 
  handleLikes           = () => firebase.database().ref('articles/' + this.props.match.params.string + '/likes/').transaction( value => value + 1 );
  handleSuperLikes      = () => firebase.database().ref('articles/' + this.props.match.params.string + '/superlikes/').transaction( value => value + 1 );
  handleDislikes        = () => firebase.database().ref('articles/' + this.props.match.params.string + '/dislikes/').transaction( value => value + 1 );
  relatedContent        = () => {
      
      let array;
      let slice;
      let random;
      let res;
      
      array = Object.keys(Data);
      random = Math.floor(Math.random() * (array.length - 3));
      slice = array.slice(random, random + 3);
      res = slice.map( value => <div><a href = {'/' + value}>{Data[value].title}</a></div> );
                      
      this.setState({ relatedContent: res });
        
  }

  render() {
          
    return (
      <div className = 'Post'>
            {!this.state.error ? 
                [<div className = 'Header'>
                    <h1>{this.state.title ? this.state.title : null}</h1>
                    <div className = 'Infopost'>
                        <p className = 'Author'>
                            <img id = 'Erik' src = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg'></img>
                            <span>Erik Martín Jordán,</span>
                            <span>{this.state.date  ? [' ' + this.state.date[1],' ',this.state.date[2]]  : null}</span>
                        </p>
                        <div className = 'i'>👀 {this.state.views ? parseInt(this.state.views).toLocaleString('es') : null}</div>
                        <div className = 'i' onClick = {this.state.user ? this.handleLikes : this.showBanner}>👏 {this.state.likes ? this.state.likes : null}</div>
                        <div className = 'i' onClick = {this.state.user ? this.handleSuperLikes : this.showBanner}>🎉 {this.state.superlikes ? this.state.superlikes : null}</div>
                    </div>
                </div>,
                <div className = 'Content'>
                    {this.state.text ? <ReactMarkdown source = {this.state.text} escapeHtml = {false} renderers = {{link : props => <a href={props.href} target = '_blank' rel = 'noindex noreferrer noopener'>{props.children}</a>}}/> : null}
                </div>,
                <div className = 'Infopost'>
                    <div></div>
                    <div className = 'i'>👀 {this.state.views ? parseInt(this.state.views).toLocaleString('es') : null}</div>
                    <div className = 'i' onClick = {this.state.user ? this.handleLikes : this.showBanner}>👏 {this.state.likes ? this.state.likes : null}</div>
                    <div className = 'i' onClick = {this.state.user ? this.handleSuperLikes : this.showBanner}>🎉 {this.state.superlikes ? this.state.superlikes : null}</div>
                </div>,
                <div className = 'Related'>
                    <h2>Otros artículos</h2>
                    {this.state.relatedContent}
                </div>]
                :
                <Default></Default>
            }
            {this.state.render ? <Login hide = {this.hideBanner}></Login> : null}
      </div>
    );
  }
}

export default Post;
