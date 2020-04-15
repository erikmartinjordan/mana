import React, { useEffect, useState }    from 'react';
import firebase, {auth}                  from '../Functions/Firebase';
import UserAvatar                        from '../Functions/UserAvatar';
import Alert                             from '../Functions/Alert';
import GetPoints                         from '../Functions/GetPoints';
import GetLevel                          from '../Functions/GetLevelAndPointsToNextLevel';
import insertNotificationAndReputation   from '../Functions/InsertNotificationAndReputationIntoDatabase';
import Accounts                          from '../Rules/Accounts';
import '../Styles/NewPost.css';

const NewPost = ({hide}) => {
    
    const [alertTitle, setAlertTitle]       = useState(null);
    const [alertMessage, setAlertMessage]   = useState(null);
    const [avatar, setAvatar]               = useState(null);
    const [displayAlert, setDisplayAlert]   = useState(false);
    const [maxLengthPost, setMaxLengthPost] = useState(null);
    const [mdFormat, setMdFormat]           = useState(false);
    const [message, setMessage]             = useState('');
    const [nickName, setNickName]           = useState(null);
    const [timeSpanPosts, setTimeSpanPosts] = useState(null);
    const [title, setTitle]                 = useState('');
    const [user, setUser]                   = useState([]);
    const points                            = GetPoints(nickName ? nickName : user ? user.uid : null);
    const level                             = GetLevel(...points)[0];
    
    useEffect( () => {
        
        auth.onAuthStateChanged( user => { 
            
            if(user){
                
                firebase.database().ref(`users/${user.uid}`).on('value', snapshot => {
                    
                    let userInfo = snapshot.val();
                    
                    if(userInfo){
                        
                        let nickName;
                        let avatar;
                        let canWriteInMd;
                        let timeSpanPosts;
                        let maxLengthPost;
                        
                        if(userInfo.account === 'premium'){
                            
                            timeSpanPosts = Accounts['premium'].messages.timeSpanPosts;
                            maxLengthPost = Accounts['premium'].messages.maxLength;
                            canWriteInMd  = Accounts['premium'].mdformat ? true : false;
                            
                        }
                        else{
                            
                            let rangeOfLevels = Object.keys(Accounts['free']);
                            let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level));
                            
                            timeSpanPosts = Accounts['free'][closestLevel].messages.timeSpanPosts;
                            maxLengthPost = Accounts['free'][closestLevel].messages.maxLength;
                            canWriteInMd  = Accounts['free'][closestLevel].mdformat ? true : false;
                            
                        }
                        
                        if(userInfo.anonimo){
                            
                            nickName = userInfo.nickName;
                            avatar   = userInfo.avatar;  
                            
                        } 
                        
                        setMdFormat(canWriteInMd);
                        setTimeSpanPosts(timeSpanPosts);
                        setMaxLengthPost(maxLengthPost);
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
    
    const closeNewPost = (secondsToClose) => {
        
        setTimeout(hide, secondsToClose * 1000);
        
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
                    onKeyDown   = {(e) => {e.target.style.height = `${e.target.scrollHeight}px`}}
                />
                <Hints mdFormat = {mdFormat}/>
                <button className = 'bottom' onClick = {() => reviewTitleAndMessage()}>Enviar</button>
            </div>
            <div className = 'Invisible' onClick = {hide}></div>
            {displayAlert && <Alert title = {alertTitle} message = {alertMessage}/>}
        </div>
    );
    
}

export default NewPost;

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