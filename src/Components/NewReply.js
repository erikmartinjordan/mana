import React, { useContext, useEffect, useState }    from 'react'
import { Link }                                      from 'react-router-dom'
import Login                                         from './Login'
import Alert                                         from './Alert'
import UserAvatar                                    from './UserAvatar'
import Hints                                         from './Hints'
import EmojiTextarea                                 from './EmojiTextarea'
import Loading                                       from './Loading'
import UserContext                                   from '../Functions/UserContext'
import { db, increment, onValue, push, ref, update } from '../Functions/Firebase'
import GetPoints                                     from '../Functions/GetPoints'
import { GetClosestLevel }                           from '../Functions/GetLevelAndPointsToNextLevel'
import GetNumberOfReplies                            from '../Functions/GetNumberOfReplies'
import insertNotificationAndReputation               from '../Functions/InsertNotificationAndReputationIntoDatabase'
import Accounts                                      from '../Rules/Accounts'
import '../Styles/NewReply.css'

const NewReply = ({ postId }) => {
    
    const [alertTitle, setAlertTitle]             = useState(null)
    const [alertMessage, setAlertMessage]         = useState(null)
    const [avatar, setAvatar]                     = useState(null)
    const [maxLengthReply, setMaxLengthReply]     = useState(null)
    const [message, setMessage]                   = useState('')
    const [nickName, setNickName]                 = useState(null)
    const [sending, setSending]                   = useState(false)
    const [showLogin, setShowLogin]               = useState(false)
    const [timeSpanReplies, setTimeSpanReplies]   = useState(null)
    const { user }                                = useContext(UserContext)
    const points                                  = GetPoints(nickName || user?.uid)
    const closestLevel                            = GetClosestLevel(nickName || user?.uid)
    const numReplies                              = GetNumberOfReplies(user?.uid)
    
    useEffect(() => {
        
        if(user){
            
            let unsubscribe = onValue(ref(db, `users/${user.uid}`), snapshot => {
                
                let userInfo = snapshot.val()
                
                if(userInfo){
                    
                    setTimeSpanReplies(Accounts[userInfo.account]?.messages?.timeSpanReplies ?? Accounts['free'][closestLevel]?.messages?.timeSpanReplies)
                    setMaxLengthReply(Accounts[userInfo.account]?.messages?.maxLength        ?? Accounts['free'][closestLevel]?.messages?.maxLength)
                    setNickName(userInfo.nickName)
                    setAvatar(userInfo.avatar)
                    
                }
                
            })

            return () => unsubscribe()
            
        }
        
    }, [user, closestLevel])
    
    const alert = (title, message) => {
        
        setSending(false)
        setAlertTitle(title)
        setAlertMessage(message)
        
    }
    
    const resetReply = (secondsToClose) => {
        
        setSending(false)
        setTimeout(() => setMessage(''), secondsToClose * 1000)
        
    }
    
    const sendPost = () => {
        
        let now = Date.now()
        let slicedReply = message.slice(0, 50) + '...'
        
        let userName  = nickName || user.displayName
        let userUid   = nickName || user.uid
        let userPhoto = avatar   || user.photoURL
        
        let url     = postId
        let replyId = push(ref(db)).key
        
        let reply = {
            
            message:    message,
            timeStamp:  now,
            userName:   userName,
            userUid:    userUid,
            userPhoto:  userPhoto
            
        }
        
        let userProps = {
            
            name: userName,
            profilePic: userPhoto,
            numReplies: increment(1),
            [`lastReplies/${replyId}`]: postId,
            [`replies/timeStamp`]: now
        }
        
        update(ref(db, `posts/${postId}/replies/${replyId}`), reply)
        update(ref(db, `replies/${replyId}`), {...reply, ...{postId: postId}})
        update(ref(db, `users/${userUid}`), userProps)
        
        insertNotificationAndReputation(userUid, 'reply', 'add', points, url, slicedReply, postId, replyId)

        alert('Bien', '¡Mensaje enviado!')
        
        resetReply(2)
       
    }
    
    const reviewTimeLimits = async () => {

        let repliesRef = ref(db, `users/${user.uid}/replies/timeStamp`)
        
        onValue(repliesRef, snapshot => {

            let lastUserMessage = snapshot.val()
        
            if(Date.now() - lastUserMessage < timeSpanReplies) 
                alert('Ups...', `Se permite un mensaje cada ${timeSpanReplies/(1000 * 60)} minutos para una cuenta gratuita`)
            else
                setTimeout(() => sendPost(), 50)


        }, { onlyOnce: true })
        
    }
    
    const reviewMessage = () => {

        setSending(true)
        
        if(message === '')                 
            alert('Ups...', 'El mensaje no puede estar vacío')
                
        else if(message.length > maxLengthReply) 
            alert('Ups...', `El mensaje no puede superar los ${maxLengthReply} caracteres para una cuenta gratuita`)
        
        else
            reviewTimeLimits()
        
    }
    
    return(
        <React.Fragment>
            { user
            ? <React.Fragment>
                <div className = 'NewReply'>
                    <div className = 'NewReply-Wrap'>
                        <div className = 'User'>
                            <UserAvatar user = {user} allowAnonymousUser = {true}/>
                            <span>{nickName ? nickName : user.displayName}</span>
                        </div>
                        <EmojiTextarea   
                            message     = {message}
                            setMessage  = {setMessage}
                            maxLength   = {maxLengthReply}
                            type        = {'reply'}
                        />
                        <button className = 'send' onClick = {reviewMessage} disabled = {sending}>{sending ? <Loading type = {'Reply'}/> : 'Enviar'}</button>
                        { numReplies === 0 
                        ? <div className = 'NewUser'>
                            👋 Hola, antes de publicar, échale un vistazo a las <Link to = '/guias'>guías de publicación</Link>.
                          </div>
                        : null
                        }
                    </div>
                </div>
                <Hints/>
            </React.Fragment>
            : <button id = 'reply' onClick = {() => setShowLogin(true)}>Responder</button>  
            }
            <Alert 
                message    = {alertMessage}
                title      = {alertTitle} 
                setMessage = {setAlertMessage}
                setTitle   = {setAlertTitle}
            />
            {showLogin 
            ? <Login hide = {() => setShowLogin(false)}/>
            : null 
            }
        </React.Fragment>
    )
    
}

export default NewReply