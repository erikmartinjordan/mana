import React, { Component, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Fingerprint from 'fingerprintjs';
import firebase, { auth } from '../Functions/Firebase';
import Default from './Default';
import Login from './Login';
import Data from '../Posts/_data';
import '../Styles/Post.css';

const Post = (props) => {
    
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState(null);
    const [error, setError] = useState(false);
    const [likes, setLikes] = useState('');
    const [render, setRender] = useState(false);
    const [superlikes, setSuperlikes] = useState('');
    const [text, setText] = useState(null);
    const [title, setTitle] = useState('');
    const [user, setUser] = useState(null);
    const [views, setViews] = useState(null);
    const url = props.match.params.string;
    
    useEffect( () => {
        // Add title and meta description
        document.title = title + ' - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = description; 
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );   
    })

    useEffect( () => { 
        
      auth.onAuthStateChanged( user => setUser(user) );
        
      try{
          // Get .md post
          const readmePath = require('../Posts/' + url + '.md'); 
          
          // Fecth response and load Instagram and Twitter scripts
          fetch(readmePath).then(response => response.text()).then(text => setText(text)).then( () => {
              if(window.instgrm) window.instgrm.Embeds.process();
              if(window.twttr) window.twttr.widgets.load();
          });
          
          // Get info from Json
          let title         = Data[url].title;
          let date          = Data[url].date;
          let description   = Data[url].description;
          
          setTitle(title);
          setDate(date);
          setDescription(description);
          
          // Get infro from Views and Likes
          firebase.database().ref('articles/' + url).on('value', snapshot => {
                if(snapshot.val()){
                    setViews(snapshot.val().views);
                    setLikes(snapshot.val().likes);
                    setSuperlikes(snapshot.val().superlikes)
                }
          })
          
          // Update counters 
          firebase.database().ref('articles/' + url + '/views/').transaction( value => value + 1 );
          
      }
      catch(e){
          // Md content doesn't exist
          setError(true);
      }  
        
    }, [])
    
    const handleLikes           = () => firebase.database().ref('articles/' + url+ '/likes/').transaction( value => value + 1 );
    const handleSuperLikes      = () => firebase.database().ref('articles/' + url + '/superlikes/').transaction( value => value + 1 );
    const handleAd              = () => {
        
        // Getting fingerprint of the user
        var fingerprint = new Fingerprint().get();
        
        firebase.database().ref('ads/' + fingerprint + '/clicks/').transaction(value => value + 1);
    }
    
    const relatedContent = () => {

        let array;
        let slice;
        let random;
        let res;
        let nArticles;

        nArticles = (views && views > 1000) ? 3 : 4;

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

    return (
    <div className = 'Post'>
            {!error ? 
                [<div className = 'Header'>
                    <h1>{title}</h1>
                    <div className = 'Infopost'>
                        <p className = 'Author'>
                            <img id = 'Erik' src = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg'></img>
                            <span>Erik Martín Jordán,</span>
                            <span>{date && [' ' + date[1],' ', date[2]]}</span>
                        </p>
                        <div className = 'i'>👀 {views && parseInt(views).toLocaleString('es')}</div>
                        <div className = 'i' onClick = {user ? handleLikes : () => setRender(true)}>👏 {likes}</div>
                        <div className = 'i' onClick = {user ? handleSuperLikes : () => setRender(true)}>🎉 {superlikes}</div>
                    </div>
                </div>,
                <div className = 'Content'>
                    {text &&
                    <ReactMarkdown 
                    source = {text} 
                    escapeHtml = {false} 
                    renderers = {{link : props => <a href = {props.href} target = '_blank' rel = 'noindex noreferrer noopener'>{props.children}</a>}}
                    /> 
                    }
                </div>,
                <div className = 'Infopost'>
                    <div></div>
                    <div className = 'i'>👀 {parseInt(views).toLocaleString('es')}</div>
                    <div className = 'i' onClick = {user ? handleLikes : () => setRender(true)}>👏 {likes}</div>
                    <div className = 'i' onClick = {user ? handleSuperLikes : () => setRender(true)}>🎉 {superlikes}</div>
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
                        {views > 1000 &&
                        <a onClick = {handleAd} 
                            target = '_blank'
                            href = 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1772106&hl=es&city=9395' 
                            className = 'Ad'>
                            <p>✨ Reserva tu hotel en Agoda. Precios mejores que en Booking.</p>
                            <span className = 'Tag Yellow'>Ver hoteles →</span>
                        </a>
                        }
                        <a onClick = {() => setRender(true)} className = 'Otro'>
                            <p>👋 Accede a Nomoresheet para votar y comentar.</p>
                            <span className = 'Access'>Acceder →</span>
                        </a>
                        {relatedContent()}
                    </div>
                </div>]
                :
                <Default></Default>
            }
            {render && <Login hide = {() => setRender(false)}/>}
            {Data[url].privat && !user && <Login hide = {() => setRender(false)}/>}
    </div>
    );
}

export default Post;
