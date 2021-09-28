import React, { useState, useEffect, useRef }         from 'react'
import TagInput                                       from 'react-easy-tag-input'
import Alert                                          from './Alert'
import { db, get, onValue, ref, runTransaction, set } from '../Functions/Firebase'
import GetPoints                                      from '../Functions/GetPoints'
import GetLevel                                       from '../Functions/GetLevelAndPointsToNextLevel'
import normalize                                      from '../Functions/NormalizeWord'
import Accounts                                       from '../Rules/Accounts'
import '../Styles/EditPost.css'

const EditPost = ({ admin, postId, replyId, type, authorId, uid }) => {
    
    const refTextarea           = useRef(null)
    const [alert, setAlert]     = useState(null)
    const [message, setMessage] = useState(null)
    const [canEdit, setCanEdit] = useState(false)
    const [tags, setTags]       = useState([])
    const points                = GetPoints(authorId)
    const level                 = GetLevel(points)[0]
    
    useEffect(() => {
        
        if(refTextarea.current)
            refTextarea.current.style.height = `${refTextarea.current.scrollHeight}px`    
        
    }, [message])
    
    useEffect(() => {

        let refUid = ref(db, `users/${uid}`)
        
        onValue(refUid, snapshot => {
            
            let userInfo = snapshot.val()
            
            if(userInfo){
                
                let isAdmin   = admin
                let isAuthor  = authorId === uid 
                let isPremium = false
                let canEditMessages = false
                
                if(userInfo.account){
                    
                    isPremium = true
                }
                else{
                    
                    let rangeOfLevels = Object.keys(Accounts['free'])
                    let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level))
                    
                    canEditMessages = Accounts['free'][closestLevel].edit ? true : false
                    
                }
                
                if(isAdmin)                      setCanEdit(true)
                else if(isPremium && isAuthor)   setCanEdit(true)
                else if(canEditMessages)         setCanEdit(true)
                else                             setCanEdit(false)
                
            }
            else{
                
                setCanEdit(false)
            }
            
        })
        
    }, [level, uid, admin, authorId])
    
    const editMessage = async () => {
        
        if(type === 'post'){

            let { message, tags } = (await get(ref(db, `posts/${postId}`))).val()
            
            setMessage(message)
            
            if(tags)
                setTags(Object.keys(tags))
            
        }
        else{

            let { message } = (await get(ref(db, `posts/${postId}/replies/${replyId}`))).val()
            
            setMessage(message)
            
        }
        
    }
    
    const handleMessage = (e) => {
        
        e.target.style.height = 'inherit'
        e.target.style.height = `${e.target.scrollHeight}px` 
        
        setMessage(e.target.value)
        
    }
    
    const submitMessage = () => {
        
        if(type === 'post'){
            
            let normalizedTags = tags.map(tag => normalize(tag)) 
            let tagsObject     = normalizedTags.reduce((acc, tag) => ((acc[tag] = true, acc)), {})

            set(ref(db, `posts/${postId}/message`), message)
            set(ref(db, `posts/${postId}/tags`), tagsObject)
            runTransaction(ref(db, `posts/${postId}/edited`), _ => Date.now())
            
            normalizedTags.forEach(tag => runTransaction(ref(db, `tags/${tag}/counter`), value => ~~value + 1))
            
        }
        else{

            set(ref(db, `posts/${postId}/replies/${replyId}/message`), message)
            runTransaction(ref(db, `posts/${postId}/replies/${replyId}/edited`), _ => Date.now())
            
        }
        
        setAlert(true)
        
        setTimeout( () => setAlert(false), 1500)
        setTimeout( () => setMessage(null), 1500)
        
    }
    
    return (
        <div className = 'Edit'>
            { message 
            ? <div className = 'Edit-Message'>
                <div className = 'Edit-Message-Wrap'>
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
            { canEdit
            ? <button onClick = {editMessage} className = 'Edit'>Editar</button>
            : null
            }
            { alert
            ? <Alert title = 'Genial' message = 'Mensaje editado'></Alert>
            : null
            }
        </div>
    )
    
}

export default EditPost