import React, { useContext, useEffect, useState }                    from 'react'
import TagInput                                                      from './TagInput'
import Alert                                                         from './Alert'
import UserAvatar                                                    from './UserAvatar'
import Hints                                                         from './Hints'
import EmojiTextarea                                                 from './EmojiTextarea'
import { db, increment, onValue, push, ref, runTransaction, update } from '../Functions/Firebase'
import GetPoints                                                     from '../Functions/GetPoints'
import insertNotificationAndReputation                               from '../Functions/InsertNotificationAndReputationIntoDatabase'
import normalize                                                     from '../Functions/NormalizeWord'
import UserContext                                                   from '../Functions/UserContext'
import unmount                                                       from '../Functions/Unmount'
import { GetClosestLevel }                                           from '../Functions/GetLevelAndPointsToNextLevel'
import Accounts                                                      from '../Rules/Accounts'
import '../Styles/NewPost.css'
import '../Styles/DeletePost.css';

const NewPost = ({ hide }) => {
    
    const [alertTitle, setAlertTitle]       = useState(null)
    const [alertMessage, setAlertMessage]   = useState(null)
    const [animation, setAnimation]         = useState('')
    const [avatar, setAvatar]               = useState(null)
    const [confirmation, setConfirmation]   = useState(false)
    const [maxLengthPost, setMaxLengthPost] = useState(null)
    const [message, setMessage]             = useState('')
    const [nickName, setNickName]           = useState(null)
    const [tags, setTags]                   = useState([])
    const [timeSpanPosts, setTimeSpanPosts] = useState(null)
    const [title, setTitle]                 = useState('')
    const { user }                          = useContext(UserContext)
    const points                            = GetPoints(nickName || user?.uid)
    const closestLevel                      = GetClosestLevel(nickName || user?.uid)

    useEffect(() => {
        
        if(user){
            
            let unsubscribe = onValue(ref(db, `users/${user.uid}`), snapshot => {

                let userInfo = snapshot.val()
                
                if(userInfo){

                    setTimeSpanPosts(Accounts[userInfo.account]?.messages?.timeSpanPosts ?? Accounts['free'][closestLevel]?.messages?.timeSpanPosts)
                    setMaxLengthPost(Accounts[userInfo.account]?.messages?.maxLength     ?? Accounts['free'][closestLevel]?.messages?.maxLength)
                    setNickName(userInfo.nickName)
                    setAvatar(userInfo.avatar)
                    
                }
                
            })

            return () => unsubscribe()
            
        } 
        
    }, [user, closestLevel])
    
    const alert = (title, message) => {
        
        setAlertTitle(title)
        setAlertMessage(message)
        
    }
    
    const closeNewPost = (secondsToClose) => {
        
        setTimeout(() => unmount(setAnimation, hide), secondsToClose * 1000)
        
    }
    
    const sendPost = () => {
        
        let now = Date.now()
        let slicedTitle = title.slice(0, 50) + '...'
        
        let normalizedTags = tags.map(tag => normalize(tag)) 
        let tagsObject     = normalizedTags.reduce((acc, tag) => ((acc[tag] = true, acc)), {})
        
        let userName  = nickName || user.displayName
        let userUid   = nickName || user.uid
        let userPhoto = avatar   || user.photoURL
        
        let postId = push(ref(db)).key
        
        let post = {
            
            title:      title,
            message:    message,
            tags:       tagsObject,
            timeStamp:  now,
            userName:   userName,
            userUid:    userUid,
            userPhoto:  userPhoto
            
        }
        
        let userProps = {
            
            name: userName,
            profilePic: userPhoto,
            numPosts: increment(1),
            [`lastPosts/${postId}`]: true,
            [`posts/timeStamp`]: now
            
        }

        update(ref(db, `posts/${postId}`), post)
        update(ref(db, `users/${userUid}`), userProps)
        
        insertTagsIntoDatabase(normalizedTags)
        insertNotificationAndReputation(userUid, 'post', 'add', points, postId, slicedTitle, postId, null)
        
        alert('Bien', '¡Mensaje enviado!')
        
        closeNewPost(2)
       
    }
    
    const insertTagsIntoDatabase = (normalizedTags) => {
        
        normalizedTags.forEach(tag => runTransaction(ref(db, `tags/${tag}/counter`), value => ~~value + 1))
        
    }
    
    const reviewTimeLimits = async () => {

        let timeStampRef = ref(db, `users/${user.uid}/posts/timeStamp`)

        onValue(timeStampRef, snapshot => {

            let lastUserMessage = snapshot.val()
        
            let levelToPublish = Object.keys(Accounts['free']).filter(key => Accounts['free'][key].messages.timeSpanPosts !== Infinity)[0]
            
            if(timeSpanPosts === Infinity)
                alert('Ups...', `Necesitas subir hasta el nivel ${levelToPublish} para poder publicar`)
            else if(Date.now() - lastUserMessage < timeSpanPosts) 
                alert('Ups...', `Se permite un mensaje cada ${timeSpanPosts/(1000 * 60 *60)} para una cuenta gratuita`)
            else
                sendPost()

        }, { onlyOnce: true })
        
    }
    
    const reviewTitleAndMessage = () => {
        
        if(title === '')                        
            alert('Ups...', 'El título no puede estar vacío')
        
        else if(message === '')                 
            alert('Ups...', 'El mensaje no puede estar vacío')
        
        else if(title.length > 140)             
            alert('Ups...', 'El título no puede superar los 140 caracteres')
        
        else if(message.length > maxLengthPost) 
            alert('Ups...', `El mensaje no puede superar los ${maxLengthPost} caracteres para una cuenta gratuita`)
        
        else
            reviewTimeLimits()
        
    }
    return(
        <div className = 'NewPost'>
            <div className = {`NewPost-Wrap ${animation}`}>
                <div className = 'User'>
                    <UserAvatar user = {user} allowAnonymousUser = {true}/>
                    <span>{nickName || user.displayName}</span>
                </div>
                <input  
                    placeholder = 'Título...' 
                    maxLength   = {140}
                    onChange    = {(e) => setTitle(e.target.value)}
                />
                <EmojiTextarea   
                    message     = {message}
                    setMessage  = {setMessage}
                    maxLength   = {maxLengthPost}
                    type        = {'post'}
                />
                <Hints/>
                <TagInput
                    limit   = {5}
                    tags    = {tags}
                    setTags = {setTags}
                    hint    = {'Añade hasta 5 etiquetas separadas por coma'}
                />
                <button className = 'send' onClick = {reviewTitleAndMessage}>Enviar</button>
            </div>
            <div className = 'Invisible' onClick = {() => setConfirmation(true)}></div>
            { confirmation
            ? <div className = 'Confirmation'>
                    <div className = 'Confirmation-Wrap'>
                        <p><b>¿Estás seguro de que quieres salir?</b></p>
                        <span>Si te marchas, se eliminará tu publicación y perderás lo escrito.</span>
                        <button onClick = {() => unmount(setAnimation, hide, () => setConfirmation(false))} className = 'Yes-Delete'>Sí, salir y eliminar publicación</button>
                        <button onClick = {() => setConfirmation(false)} className = 'No-Delete'>Cancelar</button>
                    </div>
                  </div>
            : null
            }
            <Alert 
                message    = {alertMessage}
                title      = {alertTitle} 
                setMessage = {setAlertMessage}
                setTitle   = {setAlertTitle}
            />
        </div>
    )
    
}

export default NewPost