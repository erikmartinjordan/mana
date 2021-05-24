import React, { useContext, useEffect, useState } from 'react';
import TagInput                                   from 'react-easy-tag-input';
import Alert                                      from './Alert';
import UserAvatar                                 from './UserAvatar';
import Hints                                      from './Hints';
import EmojiTextarea                              from './EmojiTextarea';
import NomoresheetLogo                            from './NomoresheetLogo';
import firebase, { firebaseServerValue }          from '../Functions/Firebase';
import GetPoints                                  from '../Functions/GetPoints';
import GetLevel                                   from '../Functions/GetLevelAndPointsToNextLevel';
import insertNotificationAndReputation            from '../Functions/InsertNotificationAndReputationIntoDatabase';
import normalize                                  from '../Functions/NormalizeWord';
import UserContext                                from '../Functions/UserContext';
import Accounts                                   from '../Rules/Accounts';
import '../Styles/NewPost.css';

const NewPost = ({hide}) => {
    
    const [alertTitle, setAlertTitle]       = useState(null);
    const [alertMessage, setAlertMessage]   = useState(null);
    const [avatar, setAvatar]               = useState(null);
    const [confirmation, setConfirmation]   = useState(false);
    const [displayAlert, setDisplayAlert]   = useState(false);
    const [maxLengthPost, setMaxLengthPost] = useState(null);
    const [mdFormat, setMdFormat]           = useState(false);
    const [message, setMessage]             = useState('');
    const [nickName, setNickName]           = useState(null);
    const [tags, setTags]                   = useState([]);
    const [timeSpanPosts, setTimeSpanPosts] = useState(null);
    const [title, setTitle]                 = useState('');
    const [uid, setUid]                     = useState(null);
    const { user }                          = useContext(UserContext);
    const points                            = GetPoints(nickName ? nickName : uid)[0];
    const level                             = GetLevel(points)[0];
    
    useEffect( () => {
        
        if(user){
            
            setUid(user.uid);
            
            firebase.database().ref(`users/${user.uid}`).on('value', snapshot => {
                
                let userInfo = snapshot.val();
                
                if(userInfo){
                    
                    let nickName;
                    let avatar;
                    let canWriteInMd;
                    let timeSpanPosts;
                    let maxLengthPost;
                    
                    if(userInfo.account === 'premium' || userInfo.account === 'infinita'){
                        
                        timeSpanPosts = Accounts[userInfo.account].messages.timeSpanPosts;
                        maxLengthPost = Accounts[userInfo.account].messages.maxLength;
                        canWriteInMd  = Accounts[userInfo.account].mdformat ? true : false;
                        
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
            
        } 
        
    }, [user, level]);
    
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
        let slicedTitle = title.slice(0, 50) + '...';
        
        let normalizedTags = tags.map(tag => normalize(tag)); 
        let tagsObject     = normalizedTags.reduce((acc, tag) => ((acc[tag] = true, acc)), {});
        
        let userName  = nickName ? nickName : user.displayName;
        let userUid   = nickName ? nickName : user.uid;
        let userPhoto = nickName ? avatar   : user.photoURL;
        
        let postId = firebase.database().ref().push().key;
        
        let post = {
            
            title:      title,
            message:    message,
            tags:       tagsObject,
            timeStamp:  now,
            userName:   userName,
            userUid:    userUid,
            userPhoto:  userPhoto
            
        };
        
        let userProps = {
            
            name: userName,
            profilePic: userPhoto,
            numPosts: firebaseServerValue.increment(1),
            [`lastPosts/${postId}`]: post,
            [`posts/timeStamp`]: now
            
        };
        
        firebase.database().ref(`posts/${postId}` ).update(post);
        firebase.database().ref(`users/${userUid}`).update(userProps);
        
        insertTagsIntoDatabase(normalizedTags);
        insertNotificationAndReputation(userUid, 'post', 'add', points, postId, slicedTitle, postId, null);
        
        alert('Bien', '¡Mensaje enviado!');
        
        closeNewPost(2);
       
    }
    
    const insertTagsIntoDatabase = (normalizedTags) => {
        
        normalizedTags.forEach(tag => firebase.database().ref(`tags/${tag}/counter`).transaction(value => ~~value + 1));
        
    }
    
    const reviewTimeLimits = async () => {
        
        let snapshot = await firebase.database().ref(`users/${user.uid}/posts/timeStamp`).once('value');
        
        let lastUserMessage = snapshot.val();
        
        let levelToPublish = Object.keys(Accounts['free']).filter(key => Accounts['free'][key].messages.timeSpanPosts !== Infinity)[0];
        
        if(timeSpanPosts === Infinity)
            alert('Ups...', `Necesitas subir hasta el nivel ${levelToPublish} para poder publicar`);
        else if(Date.now() - lastUserMessage < timeSpanPosts) 
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
                    maxLength   = {140}
                    onChange    = {(e) => setTitle(e.target.value)}
                />
                <EmojiTextarea   
                    message     = {message}
                    setMessage  = {setMessage}
                    maxLength   = {maxLengthPost}
                />
                <Hints mdFormat = {mdFormat}/>
                <TagInput
                    limit   = {5}
                    tags    = {tags}
                    setTags = {setTags}
                    hint    = {'Añade hasta 5 etiquetas separadas por coma'}
                />
                <button className = 'bottom' onClick = {reviewTitleAndMessage}>Enviar</button>
            </div>
            <div className = 'Invisible' onClick = {() => setConfirmation(true)}></div>
            { confirmation
            ? <div className = 'Confirmation'>
                    <div className = 'Confirmation-Wrap'>
                        <p><b>¿Estás seguro de que quieres salir?</b></p>
                        <p>Si te marchas, se eliminará tu publicación y perderás lo escrito.</p>
                        <button onClick = {hide}                         className = 'Yes-Delete'>Sí, salir y eliminar publicación</button>
                        <button onClick = {() => setConfirmation(false)} className = 'No-Delete'>Cancelar</button>
                    </div>
                  </div>
            : null
            }
            {displayAlert && <Alert title = {alertTitle} message = {alertMessage}/>}
        </div>
    );
    
}

export default NewPost;