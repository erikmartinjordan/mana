import React, { useState, useEffect, useRef } from 'react';
import TagInput                               from 'react-easy-tag-input';
import firebase                               from './Firebase';
import Alert                                  from '../Components/Alert';
import GetPoints                              from '../Functions/GetPoints';
import GetLevel                               from '../Functions/GetLevelAndPointsToNextLevel';
import normalize                              from '../Functions/NormalizeWord';
import Accounts                               from '../Rules/Accounts';
import '../Styles/EditPost.css';

const EditPost = ({ admin, postId, replyId, type, authorId, uid }) => {
    
    const refTextarea           = useRef(null);
    const [alert, setAlert]     = useState(null);
    const [message, setMessage] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [tags, setTags]       = useState([]);
    const points                = GetPoints(authorId);
    const level                 = GetLevel(...points)[0];
    
    useEffect( () => {
        
        if(refTextarea.current)
            refTextarea.current.style.height = `${refTextarea.current.scrollHeight}px`;    
        
    }, [message]);
    
    useEffect( () => {
        
        firebase.database().ref(`users/${uid}`).on('value', snapshot => {
            
            let userInfo = snapshot.val();
            
            if(userInfo){
                
                let isAdmin   = admin;
                let isAuthor  = authorId === uid; 
                let isPremium = false;
                let canEditMessages = false;
                
                if(userInfo.account){
                    
                    isPremium = true;
                }
                else{
                    
                    let rangeOfLevels = Object.keys(Accounts['free']);
                    let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level));
                    
                    canEditMessages = Accounts['free'][closestLevel].edit ? true : false;
                    
                }
                
                if(isAdmin)                      setCanEdit(true);
                else if(isPremium && isAuthor)   setCanEdit(true);
                else if(canEditMessages)         setCanEdit(true);
                else                             setCanEdit(false);
                
            }
            else{
                
                setCanEdit(false);
            }
            
        });
        
    }, [level, uid, admin, authorId]);
    
    const editMessage = async () => {
        
        if(type === 'post'){
            
            let snapshot = await firebase.database().ref(`posts/${postId}`).once('value');
            let { message, tags }  = snapshot.val();
            
            setMessage(message);
            
            if(tags)
                setTags(Object.keys(tags));
            
        }
        else{
            
            let snapshot = await firebase.database().ref(`posts/${postId}/replies/${replyId}/message`).once('value');
            let message  = snapshot.val();
            
            setMessage(message);
            
        }
        
    }
    
    const handleMessage = (e) => {
        
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        
        setMessage(e.target.value);
        
    }
    
    const submitMessage = () => {
        
        if(type === 'post'){
            
            let normalizedTags = tags.map(tag => normalize(tag)); 
            let tagsObject     = normalizedTags.reduce((acc, tag) => ((acc[tag] = true, acc)), {});
            
            firebase.database().ref(`posts/${postId}/message`).set(message);
            firebase.database().ref(`posts/${postId}/edited`).transaction(value => Date.now());
            firebase.database().ref(`posts/${postId}/tags`).set(tagsObject);
            
            normalizedTags.forEach(tag => firebase.database().ref(`tags/${tag}/counter`).transaction(value => ~~value + 1));
            
        }
        else{
            
            firebase.database().ref(`posts/${postId}/replies/${replyId}/message`).set(message);
            firebase.database().ref(`posts/${postId}/replies/${replyId}/edited`).transaction(value => Date.now());
            
        }
        
        setAlert(true);
        
        setTimeout( () => setAlert(false), 1500);
        setTimeout( () => setMessage(null), 1500);
        
    }
    
    return (
        <div className = 'Edit'>
            { message 
            ? <div className = 'Edit-Message'>
                <div className = 'Edit-Message-Wrap'>
                    <textarea 
                        ref      = {refTextarea} 
                        value    = {message} 
                        onChange = {(e) => handleMessage(e)} 
                    />
                    { type === 'post'
                    ? <TagInput
                        limit   = {5}
                        tags    = {tags}
                        setTags = {setTags}
                        hint    = {'Añade hasta 5 etiquetas separadas por coma'}
                      />
                    : null   
                    }
                    <button onClick = {() => submitMessage()} className = 'bottom'>Guardar</button>
                </div>
                <div className = 'Invisible' onClick = {() => setMessage(null)} ></div>
              </div>
            : canEdit && <button onClick = {() => editMessage()} className = 'Edit'>Editar</button>
            }
            {alert && <Alert title = 'Genial' message = 'Mensaje editado'></Alert>}
        </div>
    );
    
}

export default EditPost;