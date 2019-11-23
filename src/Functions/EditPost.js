import React, { useState, useEffect } from 'react';
import firebase, {auth}               from './Firebase';
import Alert                          from './Alert';
import EmojiTextarea                   from './EmojiTextarea';
import '../Styles/EditPost.css';

//--------------------------------------------------------------/
//
//
// This functions allows users to edit posts
//
//
//--------------------------------------------------------------/
const EditPost = (props) => {
    
    const [alert, setAlert] = useState(null);
    const [message, setMessage] = useState(null);
        
    const editMessage = async () => {
        
        // Reading the message from database
        const snapshot = await firebase.database().ref('posts/' + props.postId + '/replies/' + props.replyId + '/message').once('value');
        const message  = snapshot.val();
        
        //Setting message 
        setMessage(message);
        
    }
    
    const handleMessage = (e) => {
        
        // Resizing textarea after key press 
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        
        // Setting new state using new message
        setMessage(e.target.value);
        
    }
    
    const submitMessage = () => {
        
        // I need to set message and edition time in 2 lines of code, becuase otherwise, 
        // message and edition time will replace the old atributes
        
        // 1. Setting message
        firebase.database().ref('posts/' + props.postId + '/replies/' + props.replyId + '/message').set(message);
        
        // 2. Setting edition time
        firebase.database().ref('posts/' + props.postId + '/replies/' + props.replyId + '/edited').transaction(value => Date.now());
        
        // Displaying alert
        setAlert(true);
        
        // Setting timeOut to alert
        setTimeout( () => setAlert(false), 1500);
        
        // Settin timeOut to message
        setTimeout( () => setMessage(null), 1500);
    }

    return (
        <div className = 'Edit'>
            { message 
            ? <div className = 'Edit-Message'>
                <div className = 'Edit-Message-Wrap'>
                    <textarea value = {message} onChange = {(e) => handleMessage(e)}></textarea>
                    <button onClick = {() => submitMessage()} className = 'bottom'>Guardar</button>
                </div>
                {message && <div className = 'Invisible' onClick = {() => setMessage(null)} ></div>}
              </div>
            : <button onClick = {() => editMessage()} className = 'Edit'>Editar</button>
            }
            {alert && <Alert title = 'Genial' message = 'Mensaje editado'></Alert>}
        </div>
    );
    
}

export default EditPost;