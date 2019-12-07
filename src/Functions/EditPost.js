import React, { useState, useEffect } from 'react';
import firebase, {auth}               from './Firebase';
import Alert                          from './Alert';
import EmojiTextarea                  from './EmojiTextarea';
import '../Styles/EditPost.css';

//--------------------------------------------------------------/
//
//
// This functions allows users to edit posts and reples
//
//
//--------------------------------------------------------------/
const EditPost = (props) => {
    
    const [alert, setAlert] = useState(null);
    const [message, setMessage] = useState(null);
        
    const editMessage = async () => {
        
        // Getting the datapoint
        let reference;
        
        props.type === 'post'
        ? reference = firebase.database().ref('posts/' + props.post + '/message')
        : reference = firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/message');
        
        // Reading the message from database
        const snapshot = await reference.once('value');
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
        
        // Getting the datapoint
        let reference;
        
        props.type === 'post'
        ? reference = firebase.database().ref('posts/' + props.post + '/message')
        : reference = firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/message');
        
        // Setting message
        reference.set(message);
        
        // Getting edition time datapoint
        props.type === 'post'
        ? reference = firebase.database().ref('posts/' + props.post + '/edited')
        : reference = firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/edited');

        
        // Settting edition time
        reference.transaction(value => Date.now());
        
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