import React, { useEffect, useState }    from 'react';
import Login                             from './Login.js';
import firebase, {auth}                  from '../Functions/Firebase.js';
import UserAvatar                        from '../Functions/UserAvatar.js';
import Alert                             from '../Functions/Alert.js';
import GetPoints                         from '../Functions/GetPoints.js';
import insertNotificationAndReputation   from '../Functions/InsertNotificationAndReputationIntoDatabase.js';
import Accounts                          from '../Rules/Accounts.js';
import '../Styles/NewReply.css';

const NewReply = () => {
    
    const [alertTitle, setAlertTitle]             = useState(null);
    const [alertMessage, setAlertMessage]         = useState(null);
    const [avatar, setAvatar]                     = useState(null);
    const [displayAlert, setDisplayAlert]         = useState(false);
    const [maxLengthReply, setMaxLengthReply]     = useState(null);
    const [message, setMessage]                   = useState('');
    const [nickName, setNickName]                 = useState(null);
    const [showLogin, setShowLogin]               = useState(false);
    const [timeSpanReplies, setTimeSpanReplies]   = useState(null);
    const [user, setUser]                         = useState(null);
    const points                                  = GetPoints(nickName ? nickName : user ? user.uid : null);
    
    useEffect( () => {
        
        auth.onAuthStateChanged(user => {
            
            if(user){
                
                firebase.database().ref(`users/${user.uid}`).on( 'value', snapshot => {
                    
                    let userInfo = snapshot.val();

                    if(userInfo){
                        
                        let timeSpanReplies = Accounts[userInfo.account === 'premium' ? 'premium' : 'free'].messages.timeSpanReplies;
                        let maxLengtReply   = Accounts[userInfo.account === 'premium' ? 'premium' : 'free'].messages.maxLength;
                        
                        let nickName        = userInfo.anonimo  ? userInfo.nickName : null;
                        let avatar          = userInfo.anonimo  ? userInfo.avatar   : null;
                        
                        setTimeSpanReplies(timeSpanReplies);
                        setMaxLengthReply(maxLengthReply);
                        setNickName(nickName);
                        setAvatar(avatar);
                        
                    }
                    
                });
                
                setUser(user);
            }
        });
        
        
    }, []);
    
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
        
        firebase.database().ref('posts/${props.postId}/replies').push({
            
            message:    message,
            timeStamp:  now,
            userName:   nickName ? nickName : user.displayName,
            userUid:    nickName ? nickName : user.uid,
            userPhoto:  avatar   ? avatar   : user.photoURL
            
        });
        
        firebase.database().ref(`users/${user.uid}/replies/timeStamp`).transaction(value => now);
        
        insertNotificationAndReputation(nickName ? nickName : user.uid, 'reply', 'add', points);
        
        alert('Bien', '¡Mensaje enviado!');
        
        resetReply(2);
       
    }
    
    const reviewTimeLimits = async () => {
        
        let snapshot = await firebase.database().ref(`users/${user.uid}/replies/timeStamp`).once('value');
        let lastUserMessage = snapshot.val();
        
        if(Date.now() - lastUserMessage < timeSpanReplies) 
            alert('Ups...', `Se permite un mensaje cada ${timeSpanReplies/(1000 * 60)} para una cuenta gratuita. Sube a Premium.`);
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
        <div className = 'NewReply'>
            { user
            ? <div className = 'NewReply-Wrap'>
                <div className = 'User'>
                    <UserAvatar user = {user} allowAnonymousUser = {true}/>
                    <span>{nickName ? nickName : user.displayName}</span>
                </div>
                <textarea   
                    placeholder = 'Mensaje...'
                    maxLength   = {maxLengthReply}
                    onChange    = {(e) => setMessage(e.target.value)}
                />
                <button className = 'bottom' onClick = {() => reviewMessage()}>Enviar</button>
            </div>
            : <button className = 'bottom' onClick = {() => setShowLogin(true)}>Responder</button>  
            }
            {displayAlert && <Alert title = {alertTitle} message = {alertMessage}/>}
            {showLogin    && <Login/>}
        </div>
    );
    
}

export default NewReply;