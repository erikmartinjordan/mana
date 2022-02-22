import React, { useState, useEffect, useRef }         from 'react'
import TagInput                                       from './TagInput'
import Alert                                          from './Alert'
import { db, get, onValue, ref, runTransaction, set } from '../Functions/Firebase'
import GetPoints                                      from '../Functions/GetPoints'
import { GetClosestLevel }                            from '../Functions/GetLevelAndPointsToNextLevel'
import normalize                                      from '../Functions/NormalizeWord'
import unmount                                        from '../Functions/Unmount'
import Accounts                                       from '../Rules/Accounts'
import '../Styles/EditPost.css'

const EditPost = ({ admin: isAdmin, postId, replyId, type, authorId, uid }) => {
    
    const refTextarea                     = useRef(null)
    const [animation, setAnimation]       = useState('')
    const [alertTitle, setAlertTitle]     = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [message, setMessage]           = useState('')
    const [canEdit, setCanEdit]           = useState(false)
    const [tags, setTags]                 = useState([])
    const [title, setTitle]               = useState('')
    const points                          = GetPoints(authorId)
    const closestLevel                    = GetClosestLevel(points)
    
    useEffect(() => {
        
        if(refTextarea.current)
            refTextarea.current.style.height = `${refTextarea.current.scrollHeight}px`    
        
    }, [message])
    
    useEffect(() => {
        
        let unsubscribe = onValue(ref(db, `users/${uid}`), snapshot => {
            
            if(snapshot.val()){
                
                let isAuthor  = authorId === uid 
                let isPremium = snapshot.val().account === 'premium' || snapshot.val().account === 'infinita'
                let canEditMessages = Accounts['free'][closestLevel].edit
                
                setCanEdit(isAdmin || (isPremium && isAuthor) || canEditMessages)
                
            }
            else{
                
                setCanEdit(false)

            }
            
        })

        return () => unsubscribe()
        
    }, [closestLevel, uid, isAdmin, authorId])
    
    const editMessage = async () => {
        
        if(type === 'post'){

            let { title, message, tags } = (await get(ref(db, `posts/${postId}`))).val()
            
            setTitle(title)
            setMessage(message)
            setTags(Object.keys(tags || {}))
            
        }
        else{

            let { message } = (await get(ref(db, `posts/${postId}/replies/${replyId}`))).val()
            
            setMessage(message)
            
        }
        
    }

    const handleTitle = (e) => {

        setTitle(e.target.value)

    }
    
    const handleMessage = (e) => {
        
        e.target.style.height = 'inherit'
        e.target.style.height = `${e.target.scrollHeight}px` 
        
        setMessage(e.target.value)
        
    }

    const alert = (title, message) => {
        
        setAlertTitle(title)
        setAlertMessage(message)
        
    }
    
    const closeNewPost = (secondsToClose) => {
        
        setTimeout(() => unmount(setAnimation, () => setMessage(null)), secondsToClose * 1000)
        
    }
    
    const submitMessage = () => {
        
        if(type === 'post'){
            
            let normalizedTags = tags.map(tag => normalize(tag)) 
            let tagsObject     = normalizedTags.reduce((acc, tag) => ((acc[tag] = true, acc)), {})

            set(ref(db, `posts/${postId}/title`), title)
            set(ref(db, `posts/${postId}/message`), message)
            set(ref(db, `posts/${postId}/tags`), tagsObject)
            runTransaction(ref(db, `posts/${postId}/edited`), _ => Date.now())
            
            normalizedTags.forEach(tag => runTransaction(ref(db, `tags/${tag}/counter`), value => ~~value + 1))
            
        }
        else{

            set(ref(db, `posts/${postId}/replies/${replyId}/message`), message)
            runTransaction(ref(db, `posts/${postId}/replies/${replyId}/edited`), _ => Date.now())
            
        }
        
        alert('Bien', '¡Mensaje editado!')
        
        closeNewPost(2)     

    }
    
    return (
        <div className = 'Edit'>
            { message 
            ? <div className = 'Edit-Message'>
                <div className = {`Edit-Message-Wrap ${animation}`}>
                    { type === 'post'
                    ? <input  
                        maxLength   = {140}
                        value       = {title} 
                        onChange    = {handleTitle}
                      />
                    : null
                    }
                    <textarea 
                        ref      = {refTextarea} 
                        value    = {message} 
                        onChange = {handleMessage} 
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
                    <button onClick = {submitMessage} className = 'bottom'>Guardar</button>
                </div>
                <div className = 'Invisible' onClick = {() => setMessage(null)} ></div>
              </div>
            :  null
            }
            { canEdit ? <button onClick = {editMessage} className = 'Edit'>Editar</button> : null }
            <Alert 
                message    = {alertMessage}
                title      = {alertTitle} 
                setMessage = {setAlertMessage}
                setTitle   = {setAlertTitle}
            />
        </div>
    )
    
}

export default EditPost