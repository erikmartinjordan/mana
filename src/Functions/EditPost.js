import React, { useState, useEffect } from 'react';
import firebase, {auth}               from './Firebase';
import Alert                          from './Alert';
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

        // Reading the message
        const snapshot = await firebase.database().ref('posts/' + props.postId + '/replies/' + props.replyId + '/message').once('value');
        const message  = snapshot.val();
        
        //Setting message 
        setMessage(message);
        
    }
    
    const handleMessage = (e) => {
        
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
        setTimeout( () => setAlert(false), 3000);
    }

    return (
        <div className = 'Edit'>
            {message 
            ? <button onClick = {() => submitMessage()}>Guardar</button>
            : <button onClick = {() => editMessage()}>Editar</button>
            }
            {alert && <Alert title = 'Genial' message = 'Mensaje editado'></Alert>}
        </div>
    );
    
}

export default EditPost;