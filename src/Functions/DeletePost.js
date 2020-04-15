import React, { useState, useEffect } from 'react';
import { useHistory }                 from 'react-router-dom';
import firebase                       from '../Functions/Firebase';
import GetPoints                      from '../Functions/GetPoints';
import GetLevel                       from '../Functions/GetLevelAndPointsToNextLevel';
import Accounts                       from '../Rules/Accounts';
import '../Styles/DeletePost.css';

const DeletePost = ({ admin, postId, replyId, type, authorId, uid }) => {
    
    const [canDelete, setCanDelete]       = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [id, setId]                     = useState(null);
    const history                         = useHistory();
    const points                          = GetPoints(authorId);
    const level                           = GetLevel(...points)[0];
    
    useEffect( () => {
        
        firebase.database().ref(`users/${uid}`).on('value', snapshot => {
            
            let userInfo = snapshot.val();
            
            if(userInfo){
                
                let isAdmin   = admin;
                let isAuthor  = authorId === uid; 
                let isPremium = false;
                let canDeleteMessages = false;
                
                if(userInfo.account === 'premium'){
                    
                    isPremium = true;
                }
                else{
                    
                    let rangeOfLevels = Object.keys(Accounts['free']);
                    let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level));
                    
                    canDeleteMessages = Accounts['free'][closestLevel].deleteMessages ? true : false;
                    
                }
                
                if(isAdmin)                      setCanDelete(true);
                else if(isPremium && isAuthor)   setCanDelete(true);
                else if(canDeleteMessages)       setCanDelete(true);
                else                             setCanDelete(false);
                
            }
            else{
                
                setCanDelete(false);
                
            }
            
        });
        
    }, [level, uid]);
    
    const handleConfirmation = () => {
        
        setConfirmation(true);
        
    }
    
    const handleDelete = () => {
        
        type === 'post'
        ? firebase.database().ref(`posts/${postId}`).remove()
        : firebase.database().ref(`posts/${postId}/replies/${replyId}`).remove();
        
        if(type === 'post') history.push('/');
      
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