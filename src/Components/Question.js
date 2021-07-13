import React, { useEffect, useState } from 'react';
import ReactMarkdown                  from 'react-markdown';
import { Link }                       from 'react-router-dom';
import moment                         from 'moment';
import Linkify                        from 'react-linkify';
import Verified                       from './Verified';
import Loading                        from './Loading';
import Likes                          from './Likes';
import UserAvatar                     from './UserAvatar';
import EditPost                       from './EditPost';
import DeletePost                     from './DeletePost';
import CopyLink                       from './CopyLink';
import firebase                       from '../Functions/Firebase';
import GetPoints                      from '../Functions/GetPoints';
import GetLevel                       from '../Functions/GetLevelAndPointsToNextLevel';
import Accounts                       from '../Rules/Accounts';
import '../Styles/Question.css';

const Question = ({ admin, postId, setTitle, uid }) => {

    const [question, setQuestion] = useState('');
    
    useEffect ( () => {
        
        if(question){
            document.title = question.title + ' - Nomoresheet'; 
            document.querySelector('meta[name="description"]').content = question.message; 
        }      
        
    });
    
    useEffect( () => {
        
        let ref = firebase.database().ref(`posts/${postId}`);
        
        let listener = ref.on('value', snapshot => { 
            
            let question = snapshot.val();
            
            if(question){
                
                setQuestion(question)
                setTitle(question.title);
                
            }
            
        });
        
        return () => ref.off('value', listener);
        
    }, [postId, setTitle]);
    
    return(
        <React.Fragment>
        { question !== ''
        ? <div className = 'Question'>
            <div className = 'Header'>
                <UserAvatar user = {{uid: question.userUid, photoURL: question.userPhoto}}/>
                <div className = 'Author-Name-Date'> 
                    <span className = 'Author-Info'>
                        <Link to = {'/@' + question.userUid}>{question.userName}</Link> 
                        <Verified   uid = {question.userUid}/>
                    </span>
                    <time>{moment(question.timeStamp).fromNow()} {question.edited ? `(editado el ${moment(question.edited).calendar()})` : null}</time>
                </div>
            </div>
            <div className = 'Content'>
                    <QuestionContent authorId = {question.userUid} message = {question.message}/>
                    <div className = 'Meta'>
                        <CopyLink                 postId = {postId} authorId = {question.userUid}/>
                        <Likes                    postId = {postId} authorId = {question.userUid}/>
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
    
    const [mdFormat, setMdFormat] = useState(null);
    const points                  = GetPoints(authorId);
    const level                   = GetLevel(points)[0];
    const isAnonymous             = authorId.length === 5;
    
    useEffect( () => {
        
        firebase.database().ref(`users/${authorId}`).on('value', snapshot => {
            
            let userInfo = snapshot.val();
            
            if(userInfo){
                
                if(userInfo.account || isAnonymous){
                    
                    setMdFormat(true);
                }
                else{
                    
                    let rangeOfLevels = Object.keys(Accounts['free']);
                    let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level));
                    let canWriteInMd  = Accounts['free'][closestLevel].mdformat ? true : false;
                    
                    setMdFormat(canWriteInMd);
                    
                }
                
            }
            
        });
        
    }, [level, authorId, isAnonymous]);
    
    return(
        
        <React.Fragment>
            { mdFormat
            ? <MarkDownMessage   message = { message }/>
            : <NoMarkDownMessage message = { message }/>    
            }
        </React.Fragment>
        
    );
    
}
const MarkDownMessage   = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'};
    
    const renderers = {
        
        paragraph: props => <Linkify properties = {linkProperties}><p>{props.children}</p></Linkify>,
        image:     props => <img src = {props.src} onError = {(e) => e.target.style.display = 'none'} alt = {'Imagen de artículo'}></img>,
        table:     props => <div className = 'TableWrap'><table>{props.children}</table></div>
        
    }
    
    return (
        <ReactMarkdown
            source    = {message} 
            renderers = {renderers}
        />
    );
    
}
const NoMarkDownMessage = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'}; 
    
    return message.split("\n").map((text, key) => <Linkify key = {key} properties = {linkProperties}><p>{text}</p></Linkify>)
    
}