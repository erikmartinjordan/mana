import React, { useEffect, useState } from 'react';
import ReactMarkdown                  from 'react-markdown';
import { Link }                       from 'react-router-dom';
import buildFormatter                 from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                 from 'react-timeago/lib/language-strings/es';
import TimeAgo                        from 'react-timeago';
import Linkify                        from 'react-linkify';
import Verified                       from './Verified';
import PublicInfo                     from './PublicInfo';
import Loading                        from './Loading';
import Likes                          from '../Functions/Likes';
import firebase                       from '../Functions/Firebase';
import EditPost                       from '../Functions/EditPost';
import DeletePost                     from '../Functions/DeletePost';
import UserAvatar                     from '../Functions/UserAvatar';
import '../Styles/Question.css';

const formatter = buildFormatter(spanishStrings);

const Question = ({ admin, postId, setTitle, uid }) => {

    const [question, setQuestion] = useState('');
    
    useEffect ( () => {
        
        if(question){
            document.title = question.title + ' - Nomoresheet'; 
            document.querySelector('meta[name="description"]').content = question.message; 
        }     
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );      
        
    });
    
    useEffect( () => {
        
        firebase.database().ref(`posts/${postId}`).on('value', snapshot => { 
            
            let question = snapshot.val();
            
            if(question){
                
                setQuestion(question)
                setTitle(question.title);
                
            }
            
        });
        
    }, [window.location.href]);
    
    return(
        <React.Fragment>
        { question !== ''
        ? <div className = 'Question'>
            <div className = 'Header'>
                <UserAvatar user = {{uid: question.userUid, photoURL: question.userPhoto}}/>
                <div className = 'Author-Name-Date'> 
                    <span className = 'Author-Info'>
                        <Link to = {'/@' + question.userUid}>{question.userName}</Link> 
                        <PublicInfo uid = {question.userUid} canvas = 'title'/>
                        <Verified   uid = {question.userUid}/>
                    </span>
                    <TimeAgo formatter = {formatter} date = {question.timeStamp}/>
                </div>
            </div>
            <div className = 'Content'>
                    <QuestionContent authorId = {question.userUid} message = {question.message}/>
                    <div className = 'Meta'>
                        <Likes user = {{uid: question.userUid}} post = {postId}></Likes>
                        <EditPost   type = 'post' postId = {postId} authorId = {question.userUid} admin = {admin} uid = {uid}/>
                        <DeletePost type = 'post' postId = {postId} authorId = {question.userUid} admin = {admin} uid = {uid}/>
                    </div>
            </div>
         </div> 
        : <Loading type = 'Question'/>
        }
        </React.Fragment>
    );
}

export default Question;

const QuestionContent   = ({ authorId, message }) => {
    
    const [premium, setPremium] = useState(null);
    
    useEffect( () => {
        
        firebase.database().ref(`users/${authorId}`).on('value', snapshot => {
            
            let userInfo = snapshot.val();
            
            setPremium(userInfo && userInfo.account === 'premium' ? true : false)
            
        });
        
    }, []);
    
    return(
        
        <React.Fragment>
            { premium
            ? <MarkDownMessage   message = { message }/>
            : <NoMarkDownMessage message = { message }/>    
            }
        </React.Fragment>
        
    );
    
}
const MarkDownMessage   = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'};
    
    return <ReactMarkdown source = {message} renderers = {{paragraph: props => <Linkify properties = {linkProperties}><p>{props.children}</p></Linkify>}}/>;
    
}
const NoMarkDownMessage = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'}; 
    
    return message.split("\n").map((text, key) => <Linkify key = {key} properties = {linkProperties}><p>{text}</p></Linkify>)
    
}