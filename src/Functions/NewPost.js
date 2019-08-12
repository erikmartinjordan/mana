import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase, {auth} from './Firebase.js';
import EmojiTextarea from './EmojiTextarea';
import nmsNotification from './InsertNotificationIntoDatabase.js';
import AnonymImg from './AnonymImg.js';
import Alert from './Alert.js';
import Accounts from '../Rules/Accounts.js';
import  '../Styles/NewPost.css';

const NewPost = (props) => {
    
    const [alert, setAlert]         = useState(null);
    const [avatar, setAvatar]       = useState(null);
    const [maxLength, setMaxLength] = useState(null);
    const [message, setMessage]     = useState('');
    const [nickName, setnickName]   = useState(null);
    const [send, setSend]           = useState(false);
    const [show, setShow]           = useState(true);
    const [timeLimit, setTimeLimit] = useState(null);
    const [title, setTitle]         = useState('');
    const [url, setUrl]             = useState('');
    const [user, setUser]           = useState(null);
    
    useEffect( () => { window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} ) });
        
    useEffect( () => {

        auth.onAuthStateChanged( user => {

            if(user){
              
              firebase.database().ref('users/' + user.uid).on( 'value', snapshot => {
                  
                    if(snapshot.val()) {
                        
                        // If the user is anonymous, set the nickname and avatar
                        var anonimo = snapshot.val().anonimo;
                        
                        if(anonimo){
                            setnickName(snapshot.val().nickName);
                            setAvatar(snapshot.val().avatar);
                        }
                                                
                        // Selecting timespan between messages and max Length depending on type of account
                        var typeOfAccount = snapshot.val().account ? snapshot.val().account : 'free';
                        
                        setMaxLength(Accounts[typeOfAccount].messages.maxLength);
                        setTimeLimit(Accounts[typeOfAccount].messages.timeSpanPosts);
                        
                    }
                   
              });

              setUser(user); 
            }

        });

    }, []);

    const handleSubmit = (e) => {

      if(message === '' || title === '') {
          setAlert('El título o mensaje no pueden estar vacíos.');
      }
      else{
          firebase.database().ref('users/' + user.uid + '/posts').once('value').then( snapshot => {

                var capture = snapshot.val();

                if(capture == null || Date.now() - capture.timeStamp > timeLimit){

                    // Post to database
                    var id = firebase.database().ref('posts/').push({
                        title: title,
                        message: message,
                        timeStamp: Date.now(),
                        userName: nickName ? nickName: user.displayName,
                        userPhoto: avatar ? avatar : user.photoURL,
                        userUid: nickName ? nickName : user.uid,
                        votes: 0,
                        views: 0
                    });

                    // Set timeStamp
                    firebase.database().ref('users/' + user.uid + '/posts/timeStamp').transaction( (value) => Date.now() );

                    // Increase number of views of the user's posts
                    firebase.database().ref('users/' + user.uid + '/posts/numPosts').transaction( (value) =>  value + 1 );

                    // Send notification to user
                    nmsNotification(nickName ? nickName : user.uid, 'newPost', 'add');

                    // Setting states
                    setAlert(null);
                    setSend(true);
                    setUrl(id.key)

                }
                else{
                        setAlert('Ups, solamente se permite un mensaje cada 24 horas. 😳');
                }

          });
      }

      e.preventDefault();

    }
    
    return (
        <div className = 'NewPost'>
            { !send
            ? <form onSubmit = {(e) => handleSubmit(e)}>
                {user 
                && <div className = 'User'>
                    <img src = {avatar ? avatar : user.photoURL}></img>
                    {nickName ? nickName : user.displayName}
                </div>}
                <input onChange = {(e) => {setTitle(e.target.value); setAlert(null)}}
                       className = 'Title' 
                       placeholder = 'Título...' 
                       maxLength = '140'>
                </input>
                <EmojiTextarea maxLength = {maxLength} handleChange = {(text) => {setMessage(text); setAlert(null)}}></EmojiTextarea>
                <button className = 'bottom'>Enviar</button>
              </form>
            : <div className = 'Enviado'>
                <h2>¡Gracias!</h2>
                <p>Gracias por enviar tu mensaje, puedes verlo haciendo clic {send  && <Link onClick = {props.hide} to = {'/comunidad/post/' + url}>aquí</Link>}.</p>
              </div>
            }
            {alert && <Alert message = {alert}></Alert>}
            {show  && <div className = 'Invisible' onClick = {props.hide} ></div>}
        </div>  
    );
}

export default NewPost;