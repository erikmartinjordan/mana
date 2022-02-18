import React, { useState, useEffect }               from 'react'
import { useHistory }                               from 'react-router-dom'
import Points                                       from '../Functions/PointsAndValues'
import { db, ref, onValue, remove, runTransaction } from '../Functions/Firebase'
import GetPoints                                    from '../Functions/GetPoints'
import { GetClosestLevel }                          from '../Functions/GetLevelAndPointsToNextLevel'
import Accounts                                     from '../Rules/Accounts'
import '../Styles/DeletePost.css';

const DeletePost = ({ admin: isAdmin, postId, replyId, type, authorId, uid }) => {
    
    const [canDelete, setCanDelete]       = useState(false)
    const [confirmation, setConfirmation] = useState(false)
    const history                         = useHistory()
    const points                          = GetPoints(authorId)
    const closestLevel                    = GetClosestLevel(points)

    useEffect(() => {

        let unsubscribe = onValue(ref(db, `users/${uid}`), snapshot => {
            
            if(snapshot.val()){
                
                let isAuthor = authorId === uid
                let isPremium = snapshot.val().account === 'premium' || snapshot.val().account === 'infinita'
                let canDeleteMessages = Accounts['free'][closestLevel].deleteMessages

                setCanDelete(isAdmin || (isPremium && isAuthor) || canDeleteMessages)
                
            }
            else{
                
                setCanDelete(false)
                
            }
            
        })

        return () => unsubscribe()
        
    }, [closestLevel, uid, isAdmin, authorId]);
    
    const handleConfirmation = () => {
        
        setConfirmation(true)
        
    }
    
    const handleCancellation = () => {
        
        setConfirmation(false)
        
    }
    
    const handleDelete = () => {
        
        if(type === 'post'){

            remove(ref(db, `posts/${postId}`))
            remove(ref(db, `users/${authorId}/lastPosts/${postId}`))
            runTransaction(ref(db, `users/${authorId}/numPosts`),  value => ~~value - 1)
            runTransaction(ref(db, `users/${authorId}/numPoints`), value => ~~value - Points.post)
            history.push('/')
            
        }
        
        if(type === 'reply'){

            remove(ref(db, `replies/${replyId}`))
            remove(ref(db, `users/${authorId}/lastReplies/${replyId}`))
            remove(ref(db, `posts/${postId}/replies/${replyId}`))
            runTransaction(ref(db, `users/${authorId}/numReplies`), value => ~~value - 1)
            runTransaction(ref(db, `users/${authorId}/numPoints`),  value => ~~value - Points.reply)


        }
      
        setConfirmation(false)
       
    }
    
    return(
        <React.Fragment>
            { confirmation
            ? <div className = 'Confirmation'>
                    <div className = 'Confirmation-Wrap'>
                        <p>¿Estás seguro de que quieres eliminar el {type === 'post' ? 'artículo? Se borrarán todos los comentarios.' : 'comentario?'}</p>
                        <button onClick = {handleDelete}       className = 'Yes-Delete'>Sí, eliminar</button>
                        <button onClick = {handleCancellation} className = 'No-Delete'>Cancelar</button>
                    </div>
                  </div>
            : null
            }
            <div className = 'Delete'>
                { canDelete
                ? <button className = 'Delete' onClick = {handleConfirmation}>Eliminar</button>
                : null
                }
            </div>
        </React.Fragment>
    )
    
}

export default DeletePost