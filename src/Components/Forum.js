import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import { Link } from 'react-router-dom';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import TimeAgo from 'react-timeago';
import Likes from '../Functions/Likes.js';
import Login from './Login.js';
import Data from '../Posts/_data.js';
import EmojiTextarea from '../Functions/EmojiTextarea';
import GetLastComments from '../Functions/GetLastComments';
import Users from './Users';
import '../Styles/Forum.css';

const formatter = buildFormatter(spanishStrings);

const Front = () => {
                
    const [admin, setAdmin] = useState(false);
    const [alert, setAlert] = useState('');
    const [chat, setChat] = useState('');
    const [message, setMessage] = useState('');
    const [nomore, setNomore] = useState(null);
    const [numposts, setNumposts] = useState(10);
    const [ready, setReady] = useState(false);
    const [render, setRender] = useState(false);
    const [sort, setSort] = useState('nuevo');
    const [title, setTitle] = useState('');
    const [user, setUser] = useState(null);
    const [write, setWrite] = useState(null);
    const comments = GetLastComments();
    
    //-------------------------------------------------------------
    //
    // Title, metadescription and loading emojis in svg will 
    // rerender
    //
    //------------------------------------------------------------- 
    useEffect( () => { 
        
        // Setting the title and description of the front page
        document.title = 'Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'Comunidad de Tailandia';
        
        // Drawing emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
    })    
    //-------------------------------------------------------------
    //
    // Auth of user and last message
    //
    //------------------------------------------------------------- 
    useEffect( () => {
            
        // Checking if there is user and setting admin profile
        auth.onAuthStateChanged( user => {
            if(user){
                if(user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2') setAdmin(true);
                setUser(user);
            }
            else{
                setUser(null);
            }
        });
        
        // Getting the posts 
        firebase.database().ref('posts/').limitToLast(100).on('value', snapshot => { 
            
            var posts = [];
            
            snapshot.forEach( post => {
                
                var item = post.val();
                item.key = post.key;
                
                posts.push(item);
                
            });
                        
            posts.reverse();
            
            setChat(posts);
            setReady(true);
            
        });
    }, []);
       
    //-------------------------------------------------------------
    //
    // Render list of items
    //
    //------------------------------------------------------------- 
    const listItems = () => {
        
        // Number of messages depending on user's choice  
        var array = chat.slice(0, numposts);
        
        // Get unique pics arrray
        var photos = [];
        var unique = [];
        
        photos = array.map( (line) => {
            
            if(typeof line.replies !== 'undefined') 
                return Object.keys(line.replies).map( (reply)  => line.replies[reply].userPhoto);
            
        });
        
        for(var i = 0; i < photos.length; i ++) unique[i] = [...new Set(photos[i])]
        
        // Enumerate list of posts  
        var list = array.map( (line, key) =>
            <React.Fragment>
                <Link to = {'/comunidad/post/' + line.key}>
                    <li className='roll' key = {key}>
                        <div className = 'roll-wrap'>
                            <span>{line.title}</span>
                            <div className = 'Infopost-Meta-Post'>
                                <div className = 'infopost'>
                                    <img src = {line.userPhoto}></img>
                                    <p>{line.userName} <TimeAgo formatter={formatter} date={line.timeStamp}/></p>
                                </div>
                                <div className = 'Meta-Post'>
                                    <div className = 'Likes'>🌶️ {line.votes * -1}</div>
                                    <div className = 'Comments'>{line.replies ? '💬 ' + Object.keys(line.replies).length : '💬 0'}</div>
                                    {unique[key].map( (photo, key) =>         
                                      <div className = 'Multi-Pic'>
                                         <img key = {key} src = {photo}></img>
                                      </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                </Link>
            </React.Fragment>
        );
    
        return list;
    
    }   
    //-------------------------------------------------------------
    //
    // Loading blocks, before 
    //
    //------------------------------------------------------------- 
    const loading = () => {
        
        return <React.Fragment>
                    <div className = 'OrderBy'>
                        <div className = 'Loading'></div>
                        <div className = 'Loading'></div>
                        <div className = 'Loading'></div>
                    </div>
                    <div className = 'Forum-TwoCol'>
                        <ul className = 'Front'>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>                       
                        </ul>
                        <div className = 'Sidebar'>
                            <div className = 'Loading'></div> 
                            <div className = 'Loading'></div> 
                        </div>
                    </div>
                </React.Fragment>
    }
    //-------------------------------------------------------------
    //
    // Show more posts
    //
    //-------------------------------------------------------------    
    const showMorePosts = () => {
      
        var items  = numposts + 5;
        var length = chat.length;
        
        if(items >= length) setNomore(true);
        
        setNumposts(items);
    }
    //-------------------------------------------------------------
    //
    // Sort posts
    //
    //-------------------------------------------------------------    
    const orderBy = (type) => {
        
        let sorted;
        
        if(type === 'nuevo')       sorted = chat.sort( (a, b) => b.timeStamp - a.timeStamp );
        if(type === 'picante')     sorted = chat.sort( (a, b) => a.votes - b.votes );
        if(type === 'comentarios') sorted = chat.sort( (a, b) => {
            
            if(a.replies  && b.replies)   return Object.keys(b.replies).length - Object.keys(a.replies).length;
            if(!a.replies && b.replies)   return 1;
            if(a.replies  && !b.replies)  return -1;
            if(!a.replies && !b.replies)  return 0;
        });
        
        setChat(sorted);
        setSort(type);
    }
    //-------------------------------------------------------------
    //
    // Get last articles
    //
    //-------------------------------------------------------------    
    const lastArticles = (numberOfArticles) => {
        
        var posts; 

        posts = Object.keys(Data).map( (key) => {
          return <div className = 'Info'>
                      <div className = 'Bullet'></div>  
                      <Link to = {'/' + key}>{Data[key].title}</Link>
                 </div>
      });
        
        posts = posts.slice(0, numberOfArticles); 
        
        return posts;
    }
  
    //-------------------------------------------------------------
    //
    // Get last comments
    //
    //-------------------------------------------------------------     
    const lastComments = (numberOfComments) => { 
        
        var content = comments.slice(0, numberOfComments).map( reply =>
            <Link to = {'/comunidad/post/' + reply.pid} className = 'Info'>
                <div className = 'Info-Wrap'>
                    <img src = {reply.userPhoto}></img>
                    <div className = 'Author-Date'>
                        <span>{reply.author}</span>
                        <span><TimeAgo formatter = {formatter} date = {reply.timeStamp}/></span>
                    </div>
                </div>
                <div className = 'Claps'>👏  {reply.claps}</div>
            </Link>
        );
        
        return content;
    }
         
      
    return (
      <div className = 'Forum'>
        
        { ready && chat !== ''
        ?   <React.Fragment>
                <div className = 'Forum-TwoCol'>
                    <div className = 'Main'>
                        <div className = 'OrderBy'>
                            <div onClick = {() => orderBy('nuevo')} className = {sort === 'nuevo' ? 'Selected' : null}>Nuevo 🔥</div>
                            <div onClick = {() => orderBy('picante')} className = {sort === 'picante' ? 'Selected' : null}>Picante 🌶</div>
                            <div onClick = {() => orderBy('comentarios')} className = {sort === 'comentarios' ? 'Selected' : null}>Comentarios 💬</div>
                        </div>
                        <ul className = 'Front'>
                            {listItems()}
                        </ul>
                        {!nomore &&  ready && <button className = 'more' onClick = {() => showMorePosts()}>Ver más</button>}
                    </div>
                    <div className = 'Sidebar'>
                        <div className = 'LastComments'>
                            <span className = 'Title'>Últimos comentarios</span>
                            {lastComments(10)}
                        </div>
                        <div className = 'LastArticles'>
                            <span className = 'Title'>Últimos artículos</span>
                            {lastArticles(5)}
                        </div>
                        <div className = 'Users'>
                            <span className = 'Title'>Usuarios</span>
                            <Users></Users>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        : loading()
        }
        {render  && <Login hide = {() => setRender(false)}></Login>}
      </div>
    );
}

export default Front;
