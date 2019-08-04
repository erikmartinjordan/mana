import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Fingerprint from 'fingerprintjs';
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
    handleAd              = () => {
        
        // Getting fingerprint of the user
        var fingerprint = new Fingerprint().get();
        
        firebase.database().ref('ads/' + fingerprint + '/clicks/').transaction(value => value + 1);
    }
  relatedContent        = () => {
      
      let array;
      let slice;
      let random;
      let res;
      let nArticles;
      
      if(this.state.views && this.state.views > 1000) nArticles = 3;
      else                                            nArticles = 4;
      
      array = Object.keys(Data);
      random = Math.floor(Math.random() * (array.length - nArticles));
      slice = array.slice(random, random + nArticles);
      res = slice.map( value => <a className = 'Article' href = {'/' + value}>
                                    <p>📖 {Data[value].title}</p>
                                    <div className = 'Lines'>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <span className = 'Tag Red'>Leer artículo →</span>
                                </a> );
                      
      return res;
        
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
                    { this.state.text 
                    ? <ReactMarkdown source = {this.state.text} escapeHtml = {false} renderers = {{link : props => <a href={props.href} target = '_blank' rel = 'noindex noreferrer noopener'>{props.children}</a>}}/> 
                    : null}
                </div>,
                <div className = 'Infopost'>
                    <div></div>
                    <div className = 'i'>👀 {this.state.views ? parseInt(this.state.views).toLocaleString('es') : null}</div>
                    <div className = 'i' onClick = {this.state.user ? this.handleLikes : this.showBanner}>👏 {this.state.likes ? this.state.likes : null}</div>
                    <div className = 'i' onClick = {this.state.user ? this.handleSuperLikes : this.showBanner}>🎉 {this.state.superlikes ? this.state.superlikes : null}</div>
                </div>,
                <div className = 'Related'>
                    <h2>Más cosas...</h2>
                    <div className = 'Three-Block'>
                        <a href = {'/'} className = 'Community'>
                            <p>🐝 Accede a la comunidad: ¡Pregunta, opina y comenta!</p>
                            <div className = 'Community-Grid'>
                                <div>👵🏿</div>
                                <div>👱🏾‍♀️</div>
                                <div>👵🏽</div>
                                <div>👳🏼</div>
                                <div>👨🏻‍💻 </div>
                            </div>
                            <span className = 'Tag Green'>Comunidad →</span>
                        </a>
                        {this.state.views > 1000
                        ? <a onClick = {this.handleAd} 
                             target = '_blank'
                             href = 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1772106&hl=es&city=9395' 
                             className = 'Ad'>
                            <p>✨ Reserva tu hotel en Agoda. Precios mejores que en Booking.</p>
                            <span className = 'Tag Yellow'>Ver hoteles →</span>
                          </a>
                        : null
                        }
                        <a onClick = {() => this.setState({render: true})} className = 'Otro'>
                            <p>👋 Accede a Nomoresheet para votar y comentar.</p>
                            <span className = 'Access'>Acceder →</span>
                        </a>
                        {this.relatedContent()}
                    </div>
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
