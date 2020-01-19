import React, { useState, useEffect, useRef } from 'react';
import firebase, {auth}                       from './Firebase';
import Alert                                  from './Alert';
import EmojiTextarea                          from './EmojiTextarea';
import '../Styles/EditPost.css';

const EditPost = (props) => {
    
    const refTextarea           = useRef(null);
    const [alert, setAlert]     = useState(null);
    const [message, setMessage] = useState(null);
    
    
    useEffect( () => {
        
        if(refTextarea.current)
            refTextarea.current.style.height = `${refTextarea.current.scrollHeight}px`;
        
        console.log(refTextarea);
        
    }, [message]);
        
    const editMessage = async () => {
        
        let reference;
        
        props.type === 'post'
        ? reference = firebase.database().ref('posts/' + props.post + '/message')
        : reference = firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/message');
        
        const snapshot = await reference.once('value');
        const message  = snapshot.val();
        
        setMessage(message);
        
    }
    
    const handleMessage = (e) => {
        
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        
        setMessage(e.target.value);
        
    }
    
    const submitMessage = () => {
        
        let reference;
        
        props.type === 'post'
        ? reference = firebase.database().ref('posts/' + props.post + '/message')
        : reference = firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/message');
        
        reference.set(message);
        
        props.type === 'post'
        ? reference = firebase.database().ref('posts/' + props.post + '/edited')
        : reference = firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/edited');

        
        reference.transaction(value => Date.now());
        
        setAlert(true);
        
        setTimeout( () => setAlert(false), 1500);
        
        setTimeout( () => setMessage(null), 1500);
    }

    return (
        <div className = 'Edit'>
            { message 
            ? <div className = 'Edit-Message'>
                <div className = 'Edit-Message-Wrap'>
                    <textarea ref      = {refTextarea} 
                              value    = {message} 
                              onChange = {(e) => handleMessage(e)} 
                    />
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