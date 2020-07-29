import React, { useEffect, useState }    from 'react';
import Login                             from './Login';
import firebase, {auth}                  from '../Functions/Firebase';
import UserAvatar                        from '../Functions/UserAvatar';
import Alert                             from '../Functions/Alert';
import GetPoints                         from '../Functions/GetPoints';
import GetLevel                          from '../Functions/GetLevelAndPointsToNextLevel';
import insertNotificationAndReputation   from '../Functions/InsertNotificationAndReputationIntoDatabase';
import Accounts                          from '../Rules/Accounts';
import '../Styles/NewReply.css';

const NewReply = ({postId}) => {
    
    const [alertTitle, setAlertTitle]             = useState(null);
    const [alertMessage, setAlertMessage]         = useState(null);
    const [avatar, setAvatar]                     = useState(null);
    const [displayAlert, setDisplayAlert]         = useState(false);
    const [maxLengthReply, setMaxLengthReply]     = useState(null);
    const [mdFormat, setMdFormat]                 = useState(false);
    const [message, setMessage]                   = useState('');
    const [nickName, setNickName]                 = useState(null);
    const [showLogin, setShowLogin]               = useState(false);
    const [timeSpanReplies, setTimeSpanReplies]   = useState(null);
    const [user, setUser]                         = useState(null);
    const points                                  = GetPoints(nickName ? nickName : user ? user.uid : null);
    const level                                   = GetLevel(...points)[0];
    
    useEffect( () => {
        
        auth.onAuthStateChanged(user => {
            
            if(user){
                
                firebase.database().ref(`users/${user.uid}`).on( 'value', snapshot => {
                    
                    let userInfo = snapshot.val();

                    if(userInfo){
                        
                        let nickName;
                        let avatar;
                        let canWriteInMd;
                        let timeSpanReplies;
                        let maxLengthReply;
                        
                        if(userInfo.account){
                            
                            timeSpanReplies = Accounts[userInfo.account].messages.timeSpanReplies;
                            maxLengthReply  = Accounts[userInfo.account].messages.maxLength;
                            canWriteInMd    = Accounts[userInfo.account].mdformat ? true : false;
                            
                        }
                        else{
                            
                            let rangeOfLevels = Object.keys(Accounts['free']);
                            let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level));
                            
                            timeSpanReplies = Accounts['free'][closestLevel].messages.timeSpanReplies;
                            maxLengthReply  = Accounts['free'][closestLevel].messages.maxLength;
                            canWriteInMd  = Accounts['free'][closestLevel].mdformat ? true : false;
                            
                        }
                        
                        if(userInfo.anonimo){
                            
                            nickName = userInfo.nickName;
                            avatar   = userInfo.avatar;  
                            
                        }
                        
                        setMdFormat(canWriteInMd);
                        setTimeSpanReplies(timeSpanReplies);
                        setMaxLengthReply(maxLengthReply);
                        setNickName(nickName);
                        setAvatar(avatar);
                        
                    }
                    
                });
                
                setUser(user);
            }
            else{
                setUser(null);
            }
        });
        
        
    }, [level]);
    
    const alert = (title, message) => {
        
        setDisplayAlert(true);
        setAlertTitle(title);
        setAlertMessage(message);
        setTimeout( () => setDisplayAlert(false), 2000);
        
    }
    
    const resetReply = (secondsToClose) => {
        
        setTimeout(() => setMessage(''), secondsToClose * 1000);
        
    }
    
    const sendPost = () => {
        
        let now = Date.now();
        let slicedReply = message.slice(0, 50) + '...';
        let url = postId;
        
        let replyId = firebase.database().ref(`posts/${postId}/replies`).push({
            
            message:    message,
            timeStamp:  now,
            userName:   nickName ? nickName : user.displayName,
            userUid:    nickName ? nickName : user.uid,
            userPhoto:  avatar   ? avatar   : user.photoURL
            
        }).key;
        
        firebase.database().ref(`users/${nickName ? nickName : user.uid}/replies/timeStamp`).transaction(value => now);
        
        firebase.database().ref(`users/${nickName ? nickName : user.uid}/numReplies`).transaction(value => ~~value + 1);
        
        insertNotificationAndReputation(nickName ? nickName : user.uid, 'reply', 'add', points, url, slicedReply, postId, replyId);
        
        alert('Bien', '¡Mensaje enviado!');
        
        resetReply(2);
       
    }
    
    const reviewTimeLimits = async () => {
        
        let snapshot = await firebase.database().ref(`users/${user.uid}/replies/timeStamp`).once('value');
        
        let lastUserMessage = snapshot.val();
        
        if(Date.now() - lastUserMessage < timeSpanReplies) 
            alert('Ups...', `Se permite un mensaje cada ${timeSpanReplies/(1000 * 60)} minutos para una cuenta gratuita. Sube a Premium.`);
        else
            sendPost();
        
    }
    
    const reviewMessage = () => {
        
        if(message === '')                 
            alert('Ups...', 'El mensaje no puede estar vacío.');
                
        else if(message.length > maxLengthReply) 
            alert('Ups...', `El mensaje no puede superar los ${maxLengthReply} caracteres para una cuenta gratuita. Sube a Premium.`);
        
        else
            reviewTimeLimits();
        
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
                        <textarea   
                            placeholder = 'Mensaje...'
                            value       = {message}
                            maxLength   = {maxLengthReply}
                            onChange    = {(e) => setMessage(e.target.value)}
                            onKeyDown   = {(e) => {e.target.style.height = `${e.target.scrollHeight}px`}}
                        />
                        <button className = 'bottom' onClick = {() => reviewMessage()}>Enviar</button>
                    </div>
                </div>
                <Hints mdFormat = {mdFormat}/>
            </React.Fragment>
            : <button className = 'bottom' onClick = {() => setShowLogin(true)}>Responder</button>  
            }
            {displayAlert && <Alert title = {alertTitle} message = {alertMessage}/>}
            {showLogin    && <Login hide = {() => setShowLogin(false)}/>}
        </React.Fragment>
    );
    
}

export default NewReply;

const Hints = ({mdFormat}) => {
    
    let bold   = {fontWeight: 'bold'};
    let italic = {fontStyle: 'italic'};
    
    return(
        
        <div className = 'Hints' style = {{fontSize: 'small'}}>
            {mdFormat 
                ? <span>**<span style = {bold}>negrita</span>**, *<span style = {italic}>cursiva</span>*, > cita</span> 
            : null}
        </div>
        
    );
    
}