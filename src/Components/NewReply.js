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
import GetLevel                                      from '../Functions/GetLevelAndPointsToNextLevel'
import GetNumberOfReplies                            from '../Functions/GetNumberOfReplies'
import insertNotificationAndReputation               from '../Functions/InsertNotificationAndReputationIntoDatabase'
import Accounts                                      from '../Rules/Accounts'
import '../Styles/NewReply.css'

const NewReply = ({ postId }) => {
    
    const [alertTitle, setAlertTitle]             = useState(null)
    const [alertMessage, setAlertMessage]         = useState(null)
    const [avatar, setAvatar]                     = useState(null)
    const [displayAlert, setDisplayAlert]         = useState(false)
    const [maxLengthReply, setMaxLengthReply]     = useState(null)
    const [mdFormat, setMdFormat]                 = useState(false)
    const [message, setMessage]                   = useState('')
    const [nickName, setNickName]                 = useState(null)
    const [sending, setSending]                   = useState(false)
    const [showLogin, setShowLogin]               = useState(false)
    const [timeSpanReplies, setTimeSpanReplies]   = useState(null)
    const { user }                                = useContext(UserContext)
    const points                                  = GetPoints(nickName ? nickName : user ? user.uid : null)
    const level                                   = GetLevel(points)[0]
    const numReplies                              = GetNumberOfReplies(user?.uid)
    
    useEffect( () => {
        
        if(user){

            let usersRef = ref(db, `users/${user.uid}`)
            
            onValue(usersRef, snapshot => {
                
                let userInfo = snapshot.val()
                
                if(userInfo){
                    
                    let nickName
                    let avatar
                    let canWriteInMd
                    let timeSpanReplies
                    let maxLengthReply
                    
                    if(userInfo.account === 'premium' || userInfo.account === 'infinita'){
                        
                        timeSpanReplies = Accounts[userInfo.account].messages.timeSpanReplies
                        maxLengthReply  = Accounts[userInfo.account].messages.maxLength
                        canWriteInMd    = Accounts[userInfo.account].mdformat ? true : false
                        
                    }
                    else{
                        
                        let rangeOfLevels = Object.keys(Accounts['free'])
                        let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level))
                        
                        timeSpanReplies = Accounts['free'][closestLevel].messages.timeSpanReplies
                        maxLengthReply  = Accounts['free'][closestLevel].messages.maxLength
                        canWriteInMd  = Accounts['free'][closestLevel].mdformat ? true : false
                        
                    }
                    
                    if(userInfo.anonimo){
                        
                        nickName = userInfo.nickName
                        avatar   = userInfo.avatar  
                        
                    }
                    
                    setMdFormat(canWriteInMd)
                    setTimeSpanReplies(timeSpanReplies)
                    setMaxLengthReply(maxLengthReply)
                    setNickName(nickName)
                    setAvatar(avatar)
                    
                }
                
            })
            
        }
        
    }, [level, user])
    
    const alert = (title, message) => {
        
        setSending(false)
        setDisplayAlert(true)
        setAlertTitle(title)
        setAlertMessage(message)
        setTimeout(() => setDisplayAlert(false), 2000)
        
    }
    
    const resetReply = (secondsToClose) => {
        
        setSending(false)
        setTimeout(() => setMessage(''), secondsToClose * 1000)
        
    }
    
    const sendPost = () => {
        
        let now = Date.now()
        let slicedReply = message.slice(0, 50) + '...'
        
        let userName  = nickName ? nickName : user.displayName
        let userUid   = nickName ? nickName : user.uid
        let userPhoto = nickName ? avatar   : user.photoURL
        
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
                alert('Ups...', `Se permite un mensaje cada ${timeSpanReplies/(1000 * 60)} minutos para una cuenta gratuita. Sube a Premium.`)
            else
                setTimeout(() => sendPost(), 50)


        }, { onlyOnce: true })
        
    }
    
    const reviewMessage = () => {

        setSending(true)
        
        if(message === '')                 
            alert('Ups...', 'El mensaje no puede estar vacío.')
                
        else if(message.length > maxLengthReply) 
            alert('Ups...', `El mensaje no puede superar los ${maxLengthReply} caracteres para una cuenta gratuita. Sube a Premium.`)
        
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
                <Hints mdFormat = {mdFormat}/>
            </React.Fragment>
            : <button id = 'reply' onClick = {() => setShowLogin(true)}>Responder</button>  
            }
            {displayAlert && <Alert title = {alertTitle} message = {alertMessage}/>}
            {showLogin    && <Login hide = {() => setShowLogin(false)}/>}
        </React.Fragment>
    )
    
}

export default NewReply