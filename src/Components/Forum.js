import React, { useState, useEffect } from 'react';
import { Link }                       from 'react-router-dom';
import buildFormatter                 from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                 from 'react-timeago/lib/language-strings/es';
import TimeAgo                        from 'react-timeago';
import Login                          from './Login';
import firebase, {auth}               from '../Functions/Firebase';
import Likes                          from '../Functions/Likes';
import EmojiTextarea                  from '../Functions/EmojiTextarea';
import GetLastComments                from '../Functions/GetLastComments';
import Loading                        from '../Functions/Loading';
import OrderBy                        from '../Functions/OrderBy';
import UserAvatar                     from '../Functions/UserAvatar';
import Data                           from '../Posts/_data';
import '../Styles/Forum.css';

const formatter = buildFormatter(spanishStrings);

const Front = () => {
                
    const [admin, setAdmin]       = useState(false);
    const [alert, setAlert]       = useState('');
    const [chat, setChat]         = useState('');
    const [message, setMessage]   = useState('');
    const [nomore, setNomore]     = useState(null);
    const [numposts, setNumposts] = useState(10);
    const [ready, setReady]       = useState(false);
    const [render, setRender]     = useState(false);
    const [sort, setSort]         = useState('nuevo');
    const [title, setTitle]       = useState('');
    const [user, setUser]         = useState(null);
    const [write, setWrite]       = useState(null);
    const comments                = GetLastComments();
    
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
        
        // Component is mounted
        let mounted = true;
            
        // Checking if there is user and setting admin profile
        auth.onAuthStateChanged( user => {
            if(user){
                
                let admin = (user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2') ? true : false;
                
                if(mounted){
                    
                    setAdmin(admin);
                    setUser(user)
                    
                }
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
            
            if(mounted){
                
                setChat(posts);
                setReady(true);
                
            }
            
        });
        
        // Component is unmounted
        return () => {mounted = false};
        
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
            <React.Fragment key = {key}>
                <Link to = {'/comunidad/post/' + line.key}>
                    <li className = 'Post-List' key = {key}>
                        <div className = 'Post-Card'>
                            <h3>{line.title}</h3>
                            <div className = 'Infopost-Meta-Post'>
                                <div className = 'Infopost'>
                                    <UserAvatar user = {{uid: line.userUid, photoURL: line.userPhoto}}/>
                                    <p>{line.userName} <TimeAgo formatter={formatter} date={line.timeStamp}/></p>
                                </div>
                                <div className = 'Meta-Post'>
                                    <div className = 'Likes'>   🌶️ {line.voteUsers  ? Object.keys(line.voteUsers).length : 0}</div>
                                    <div className = 'Comments'>💬 {line.replies    ? Object.keys(line.replies).length   : 0}</div>
                                    {unique[key].map( (photo, key) =>         
                                      <div key = {key} className = 'Multi-Pic'>
                                         <img src = {photo}></img>
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
    // Get last articles
    //
    //-------------------------------------------------------------    
    const lastArticles = (numberOfArticles) => {
        
        var posts; 

        posts = Object.keys(Data).map( (key) => {
          return <div key = {key} className = 'Info'>
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
        
        var content = comments.slice(0, numberOfComments).map( (reply, key) =>
            <Link to = {'/comunidad/post/' + reply.pid} key = {key} className = 'Info'>
                <div className = 'Info-Wrap'>
                    <UserAvatar user = {{uid: reply.userUid, photoURL: reply.userPhoto}}/>
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
                        <OrderBy
                            chat = {chat} setChat = {setChat}
                            sort = {sort} setSort = {setSort}
                        />
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
                    </div>
                </div>
            </React.Fragment>
        : <Loading page = 'Main'/>
        }
        {render  && <Login hide = {() => setRender(false)}></Login>}
      </div>
    );
}

export default Front;
