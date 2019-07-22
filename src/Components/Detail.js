import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import { Link } from 'react-router-dom';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import TimeAgo from 'react-timeago';
import Linkify from 'react-linkify';
import Likes from '../Functions/Likes.js';
import LikesComments from '../Functions/LikesComments.js';
import Login from './Login.js';
import EmojiTextarea from '../Functions/EmojiTextarea';
import nmsNotification from '../Functions/InsertNotificationIntoDatabase.js';
import useVerifiedTag from '../Functions/VerifiedTag.js';
import Alert from '../Functions/Alert.js';

const formatter = buildFormatter(spanishStrings);

const Detail = (props) => {
        
  const [admin, setAdmin] = useState(false);
  const [alert, setAlert] = useState(null);
  const [chat, setChat] = useState(null);
  const [empty, setEmpty] = useState(true);
  const [login, setLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [render, setRender] = useState(false);
  const [reply, setReply] = useState("");
  const [send, setSend] = useState(false);
  const [timeStamp, setTimeStamp] = useState(null);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userUid, setUserUid] = useState("");
  const [views, setViews] = useState("");
  const verified = useVerifiedTag();
        
  useEffect ( () => {
      
      
      // Setting title and metadescription
      if(title)    document.title = title + ' - Nomoresheet'; 
      if(message)  document.querySelector('meta[name="description"]').content = message; 
            
      // Setting user and admin
      auth.onAuthStateChanged( (user) => {
          
          if(user && user.uid === "dOjpU9i6kRRhCLfYb6sfSHhvdBx2") setAdmin(true);
          setUser(user);

      });
      
      // If the post exists, load data and views ++
      firebase.database().ref('posts/' + props.match.params.string).once('value').then( (snapshot) => { 

            var capture = snapshot.val();
          
            if(capture){

                setEmpty(false);
                setMessage(capture.message);
                setTimeStamp(capture.timeStamp);
                setTitle(capture.title);
                setUserName(capture.userName);
                setUserPhoto(capture.userPhoto);
                setUserUid(capture.userUid);
                setViews(capture.views);
                                
                //Increase number of views of the post
                firebase.database().ref('posts/' + props.match.params.string + '/views').transaction( (value) =>  value + 1 );
                
                // Increase number of views in the user's profile
                firebase.database().ref('users/' + capture.userUid + '/postsViews').transaction( (value) => value + 1);
                
            }

      });
            
      // Load all the replies of the post
      firebase.database().ref('posts/' + props.match.params.string + '/replies/').on('value', (snapshot) => { 

            var array = [];
            var uids = [];

            snapshot.forEach(function(childSnapshot){

                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                
                array.push(item);

            });
          
            setChat(array);
            setReady(true);
          
      });
      
      // Loading emojis in svg
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
                
  }, []);

    
  const handleSubmit = (e) => {      
      
      //message can't be empty 
      if(reply === "") setAlert("El mensaje no puede estar vacío.");
      else{      
          
          firebase.database().ref('users/' + user.uid + '/replies').once('value').then( (snapshot) => {

                var capture = snapshot.val();

                if(capture == null || Date.now() - capture.timeStamp > 300000 || user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2'){

                    firebase.database().ref('posts/' + props.match.params.string + '/replies/').push({
                        message: reply,
                        timeStamp: Date.now(),
                        userName: user.displayName,
                        userPhoto: user.photoURL,
                        userUid: user.uid,
                    });

                    //Set timestamp
                    firebase.database().ref('users/' + user.uid + '/replies/timeStamp').transaction( (value) => Date.now() );
                    
                    //Increase number of replies of the users
                    firebase.database().ref('users/' + user.uid + '/replies/numReplies').transaction( (value) => value + 1 );
                    
                    // Notification after user replies something
                    nmsNotification(user.uid, 'reply', 'add');
                         
                    // Sending ok
                    setReply("");
                    setSend(true);
                    
                    // Disable notification after 2 seconds
                    setTimeout( () => { setSend(false), 2000 });

                }
                else{
                        setAlert("Ups, debes esperarte 5 minutos para comentar de nuevo.");
                }

          });
      }
         
      e.preventDefault();  
       
  } 

  const handleDeletePost = (e) => firebase.database().ref('posts/' + props.match.params.string).remove();
    
  const handleDeleteReply = (e) => {
      
      firebase.database().ref('posts/' + props.match.params.string + '/replies/' + e.target.getAttribute("id") ).remove();
      e.preventDefault();
       
  } 
    

  const listTitle = () => {  
             
      var header =  <div className = 'title'>                    
                    {ready && !empty &&
                        <div className = 'detail-header'>
                            <h2>{title}</h2>
                            <div className = 'infopost'>
                                <img alt = {userName} src = {userPhoto}></img>
                                {userName}
                                {verified && userUid && verified[userUid].badge}
                                <TimeAgo formatter={formatter} date={timeStamp}/>
                            </div>
                        </div>
                    }
                    </div>;

        return header;

  }
      
  const listContent = () => {
      
        var htmlMessage = message.split("\n").map(text => <p>{text}</p>);
                                                         
        var content = <div className = 'content'>
                        {ready && !empty && 
                            <div>
                                <Linkify properties = {{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                                    {htmlMessage}
                                    <Likes user = {user} post = {props.match.params.string}></Likes>
                                </Linkify>
                                {user && admin &&
                                    <Link to ="/"><button className = "delete" id = {props.match.params.string} onClick={(e) => handleDeletePost(e)}>Eliminar todo el artículo</button></Link>
                                }
                            </div>
                        }
                    </div>;

        return content;

  }

  const listItems = () => {
      
    var list = chat.map( (line, index) => 
        
        <li key={line.key}>
            <div className = 'infopost'>
                <img alt={line.userName} src={line.userPhoto}></img>
                {line.userName}
                {verified && verified[line.userUid].badge}
                <TimeAgo formatter={formatter} date={line.timeStamp}/>
            </div> 
            <Linkify properties={{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                { line.message.split("\n").map(text => <p>{text}</p>) }
                <LikesComments post = {props.match.params.string} reply = {line.key} user = {user}></LikesComments>
            </Linkify>
            <div>{admin && <button className = 'delete' id={line.key} onClick={ (e) => handleDeleteReply(e)}>Eliminar comentario</button>}</div>
        </li> );
                                       
    return list;
       
  } 

  const newReply = () => {
                            
    var form =  <form onSubmit = {(e) => handleSubmit(e)}>
                    {user &&
                     <div className = 'infopost'>
                        <img alt = {user.displayName} src = {user.photoURL}></img>
                        <div>{user.displayName}</div>
                      </div>
                    }
                    <div className = 'responseBox'>
                        <EmojiTextarea handleChange = {(text) => {setReply(text); setAlert(null)}} send = {send}></EmojiTextarea>
                        <button className = 'send'>Enviar</button>
                    </div>
                </form>;
            
    return form;

  }   
                 
  return (
      <div className = 'Forum Detail'>
        
        {send && <Alert title = '¡Gracias!' message = 'Mensaje enviado'></Alert>}
        {alert && <Alert message = {alert}></Alert>}
        
        {listTitle()}   
        {listContent()}
            
        <ul className = 'replies'>
            {ready ? listItems() : "Cargando..."}
        </ul>
            
        {user && !empty && newReply()}                               
        {!user && ready && !empty  && <button className = "bottom" onClick = { () => setRender(true)}> Responder</button>}
         
        {render && <Login hide = {() => setRender(false)}></Login>}
      </div>    
  );
}

export default Detail;
