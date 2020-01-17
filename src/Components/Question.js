import React, { useEffect, useState } from 'react';
import { Link }                       from 'react-router-dom';
import buildFormatter                 from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                 from 'react-timeago/lib/language-strings/es';
import TimeAgo                        from 'react-timeago';
import Linkify                        from 'react-linkify';
import Verified                       from './Verified';
import PublicInfo                     from './PublicInfo';
import Likes                          from '../Functions/Likes';
import firebase                       from '../Functions/Firebase';
import EditPost                       from '../Functions/EditPost';
import DeletePost                     from '../Functions/DeletePost';
import UserAvatar                     from '../Functions/UserAvatar';
import '../Styles/Question.css';

const formatter = buildFormatter(spanishStrings);

const Question = (props) => {
    
    const [question, setQuestion]   = useState('');
    const [title, setTitle]         = useState('');
    const [timeStamp, setTimeStamp] = useState(null);
    const [userName, setUserName]   = useState(null);
    const [userPhoto, setUserPhoto] = useState(null);
    const [userUid, setUserUid]     = useState(null);
    
    useEffect ( () => {
        
        if(title)     document.title = title + ' - Nomoresheet'; 
        if(question)  document.querySelector('meta[name="description"]').content = question; 
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );      
        
    });
    
    useEffect( () => {
        
        firebase.database().ref(`posts/${props.postId}`).on('value', snapshot => { 
            
            let question = snapshot.val();
            
            if(question){
                
                setQuestion(question.message);
                setTimeStamp(question.timeStamp);
                setUserName(question.userName);
                setUserPhoto(question.userPhoto);
                setUserUid(question.userUid);
                props.setTitle(question.title);
                
            }
            
        });
        
        firebase.database().ref(`posts/${props.postId}/views`).transaction( value =>  value + 1 );

        
    }, [window.location.href]);
    
    return(
        <div className = 'Question'>
            <div className = 'Header'>
                <UserAvatar user = {{uid: userUid, photoURL: userPhoto}}/>
                <div className = 'Author-Name-Date'> 
                    <span className = 'Author-Info'>
                        <Link to = {'/@' + userUid}>{userName}</Link> 
                        <PublicInfo uid = {userUid} canvas = 'title'/>
                        <Verified   uid = {userUid}/>
                    </span>
                    <TimeAgo formatter = {formatter} date = {timeStamp}/>
                </div>
            </div>
            <div className = 'Content'>
                <Linkify properties = {{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                {question.split("\n").map((text, key) => <p key = {key}>{text}</p>)}
                    <div className = 'Meta'>
                        <Likes user = {{uid: userUid}} post = {props.postId}></Likes>
                        {props.admin && <EditPost   type = 'post' post = {props.postId}/>}
                        {props.admin && <DeletePost type = 'post' post = {props.postId} />}
                    </div>
                </Linkify>
            </div>
        </div> 
        
    );
}

export default Question;