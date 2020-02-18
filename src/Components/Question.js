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

const Question = (props) => {

    const [question, setQuestion] = useState('');
    
    useEffect ( () => {
        
        if(question){
            document.title = question.title + ' - Nomoresheet'; 
            document.querySelector('meta[name="description"]').content = question.message; 
        }     
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );      
        
    });
    
    useEffect( () => {
        
        firebase.database().ref(`posts/${props.postId}`).on('value', snapshot => { 
            
            let question = snapshot.val();
            
            if(question){
                
                setQuestion(question)
                props.setTitle(question.title);
                
            }
            
        });
        
        
    }, [window.location.href]);
    
    const isPremiumUser = async (uid) => {
        
        let snapshot = await firebase.database().ref(`users/${uid}`).once('value');
        
        let userInfo = snapshot.val();
        
        return userInfo && userInfo.account === 'premium' ? true : false;
        
    }
    
    const editDelete = (questionUid) => {
        
        return props.admin || (isPremiumUser(props.uid) && props.uid === questionUid);
        
    }
    
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
                    { isPremiumUser(question.userUid)
                    ? <MarkDownMessage   message = {question.message}/>
                    : <NoMarkDownMessage message = {question.message}/>
                    }
                    <div className = 'Meta'>
                            <Likes user = {{uid: question.userUid}} post = {props.postId}></Likes>
                            {editDelete(question.userUid) && <EditPost   type = 'post' post = {props.postId}/>}
                            {editDelete(question.userUid) && <DeletePost type = 'post' post = {props.postId} />}
                    </div>
            </div>
         </div> 
        : <Loading type = 'Question'/>
        }
        </React.Fragment>
    );
}

export default Question;

const MarkDownMessage   = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'};
    
    return <ReactMarkdown source = {message} renderers = {{paragraph: props => <Linkify properties = {linkProperties}><p>{props.children}</p></Linkify>}}/>;
    
}
const NoMarkDownMessage = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'}; 
    
    return message.split("\n").map((text, key) => <Linkify properties = {linkProperties}><p key = {key}>{text}</p></Linkify>)
    
}