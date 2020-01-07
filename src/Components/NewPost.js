import React, { useEffect, useState }    from 'react';
import firebase, {auth}                  from '../Functions/Firebase.js';
import UserAvatar                        from '../Functions/UserAvatar.js';
import Alert                             from '../Functions/Alert.js';
import GetPoints                         from '../Functions/GetPoints.js';
import insertNotificationAndReputation   from '../Functions/InsertNotificationAndReputationIntoDatabase.js';
import Accounts                          from '../Rules/Accounts.js';
import '../Styles/NewPost.css';

const NewPost = (props) => {
    
    const [alertTitle, setAlertTitle]       = useState(null);
    const [alertMessage, setAlertMessage]   = useState(null);
    const [avatar, setAvatar]               = useState(null);
    const [displayAlert, setDisplayAlert]   = useState(false);
    const [maxLengthPost, setMaxLengthPost] = useState(null);
    const [message, setMessage]             = useState('');
    const [nickName, setNickName]           = useState(null);
    const [timeSpanPosts, setTimeSpanPosts] = useState(null);
    const [title, setTitle]                 = useState('');
    const [user, setUser]                   = useState([]);
    const points                            = GetPoints(nickName ? nickName : user ? user.uid : null);
    
    useEffect( () => {
        
        auth.onAuthStateChanged(async user => { 
            
            if(user){
                
                firebase.database().ref(`users/${user.uid}`).on('value', snapshot => {
                    
                    let userInfo = snapshot.val();
                    
                    if(userInfo){
                        
                        let timeSpanPosts = Accounts[userInfo.account === 'premium' ? 'premium' : 'free'].messages.timeSpanPosts;
                        let maxLengthPost = Accounts[userInfo.account === 'premium' ? 'premium' : 'free'].messages.maxLength;
                        
                        let nickName      = userInfo.anonimo  ? userInfo.nickName : null;
                        let avatar        = userInfo.anonimo  ? userInfo.avatar   : null;
                        
                        setTimeSpanPosts(timeSpanPosts);
                        setMaxLengthPost(maxLengthPost);
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
    
    const closeNewPost = (secondsToClose) => {
        
        setTimeout(() => props.hide(), secondsToClose * 1000);
        
    }
    
    const sendPost = () => {
        
        let now = Date.now();
        
        firebase.database().ref('posts/').push({
            
            title:      title,
            message:    message,
            timeStamp:  now,
            userName:   nickName ? nickName : user.displayName,
            userUid:    nickName ? nickName : user.uid,
            userPhoto:  avatar   ? avatar   : user.photoURL
            
        });
        
        firebase.database().ref(`users/${user.uid}/posts/timeStamp`).transaction(value => now);
        
        insertNotificationAndReputation(nickName ? nickName : user.uid, 'newPost', 'add', points);
        
        alert('Bien', '¡Mensaje enviado!');
        
        closeNewPost(2);
       
    }
    
    const reviewTimeLimits = async () => {
        
        let snapshot = await firebase.database().ref(`users/${user.uid}/posts/timeStamp`).once('value');
        let lastUserMessage = snapshot.val();
        
        if(Date.now() - lastUserMessage < timeSpanPosts) 
            alert('Ups...', `Se permite un mensaje cada ${timeSpanPosts/(1000 * 60 *60)} para una cuenta gratuita. Sube a Premium.`);
        else
            sendPost();
        
    }
    
    const reviewTitleAndMessage = () => {
        
        if(title === '')                        
            alert('Ups...', 'El título no puede estar vacío.');
        
        else if(message === '')                 
            alert('Ups...', 'El mensaje no puede estar vacío.');
        
        else if(title.length > 140)             
            alert('Ups...', 'El título no puede superar los 140 caracteres.');
        
        else if(message.length > maxLengthPost) 
            alert('Ups...', `El mensaje no puede superar los ${maxLengthPost} caracteres para una cuenta gratuita. Sube a Premium.`);
        
        else
            reviewTimeLimits();
        
    }
    
    return(
        <div className = 'NewPost'>
            <div className = 'NewPost-Wrap'>
                <div className = 'User'>
                    <UserAvatar user = {user} allowAnonymousUser = {true}/>
                    <span>{nickName ? nickName : user.displayName}</span>
                </div>
                <input  
                    placeholder = 'Título...' 
                    maxlength   = {140}
                    onChange    = {(e) => setTitle(e.target.value)}
                />
                <textarea   
                    placeholder = 'Mensaje...'
                    maxlength   = {maxLengthPost}
                    onChange    = {(e) => setMessage(e.target.value)}
                />
                <button className = 'bottom' onClick = {() => reviewTitleAndMessage()}>Enviar</button>
            </div>
            <div className = 'Invisible' onClick = {() => props.hide()}></div>
            {displayAlert && <Alert title = {alertTitle} message = {alertMessage}/>}
        </div>
    );
    
}

export default NewPost;