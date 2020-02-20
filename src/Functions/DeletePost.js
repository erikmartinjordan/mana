import React, { useState, useEffect } from 'react';
import firebase                       from '../Functions/Firebase.js';
import '../Styles/DeletePost.css';

const DeletePost = ({ admin, postId, replyId, type, uid }) => {
    
    const [canDelete, setCanDelete]       = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [id, setId]                     = useState(null);
    
    useEffect( () => {
        
        firebase.database().ref(`users/${uid}`).on('value', snapshot => {
            
            let userInfo = snapshot.val();
            
            let isAdmin   = admin;
            let isPremium = userInfo && userInfo.account === 'premium';
            let isAuthor  = uid === replyId; 
            
            if(isAdmin) setCanDelete(true);
            if(isPremium && isAuthor) setCanDelete(true);
            
        });
        
    }, []);
    
    const handleConfirmation = () => {
        
        setConfirmation(true);
        
    }
    
    const handleDelete = () => {
        
        type === 'post'
        ? firebase.database().ref(`posts/${postId}`).remove()
        : firebase.database().ref(`posts/${postId}/replies/${replyId}`).remove();
      
        setConfirmation(false);
       
    }
    
    return(
        
        <React.Fragment>
            {confirmation &&
                <div className = 'Confirmation'>
                    <div className = 'Confirmation-Wrap'>
                        <p>¿Estás seguro de que quieres eliminar el {type === 'post' ? 'artículo? Se borrarán todos los comentarios.' : 'comentario?'}</p>
                        <button onClick = { () => handleDelete(id) }       className = 'Yes-Delete'>Sí, eliminar</button>
                        <button onClick = { () => setConfirmation(false) } className = 'No-Delete'>Cancelar</button>
                    </div>
                </div>
            }
            {canDelete && <button className = 'Delete' onClick = { (e) => handleConfirmation() }>Eliminar</button>}
        </React.Fragment>
        
    );
    
}

export default DeletePost;