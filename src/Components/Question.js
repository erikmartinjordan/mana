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
    
    const [authorName, setAuthorName]       = useState(null);
    const [authorPhoto, setAuthorPhoto]     = useState(null);
    const [authorUid, setAuthorUid]         = useState(null);
    const [question, setQuestion]           = useState('');
    const [premiumAuthor, setPremiumAuthor] = useState(false);
    const [title, setTitle]                 = useState('');
    const [timeStamp, setTimeStamp]         = useState(null);

    
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
                setAuthorName(question.userName);
                setAuthorPhoto(question.userPhoto);
                setAuthorUid(question.userUid);
                props.setTitle(question.title);
                
            }
            
        });
        
        firebase.database().ref(`posts/${props.postId}/views`).transaction( value =>  value + 1 );
        
        
    }, [window.location.href]);
    
    useEffect( () => {
        
        if(authorUid){
            
            firebase.database().ref('users/' + authorUid).on( 'value', snapshot => {
                
                if(snapshot.val()){
                    
                    let capture = snapshot.val();
                    
                    capture.account === 'premium'
                    ? setPremiumAuthor(true)
                    : setPremiumAuthor(false);
                }
            
            });
            
        }

        
    }, [authorUid]);
    
    return(
        <React.Fragment>
        { question !== ''
        ? <div className = 'Question'>
            <div className = 'Header'>
                <UserAvatar user = {{uid: authorUid, photoURL: authorPhoto}}/>
                <div className = 'Author-Name-Date'> 
                    <span className = 'Author-Info'>
                        <Link to = {'/@' + authorUid}>{authorName}</Link> 
                        <PublicInfo uid = {authorUid} canvas = 'title'/>
                        <Verified   uid = {authorUid}/>
                    </span>
                    <TimeAgo formatter = {formatter} date = {timeStamp}/>
                </div>
            </div>
            <div className = 'Content'>
                <Linkify properties = {{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                    { premiumAuthor
                    ? <ReactMarkdown source = {question}/> 
                    : question.split("\n").map((text, key) => <p key = {key}>{text}</p>)
                    }
                    <div className = 'Meta'>
                            <Likes user = {{uid: authorUid}} post = {props.postId}></Likes>
                            {props.admin && <EditPost   type = 'post' post = {props.postId}/>}
                            {props.admin && <DeletePost type = 'post' post = {props.postId} />}
                    </div>
                </Linkify>
            </div>
         </div> 
        : <Loading type = 'Question'/>
        }
        </React.Fragment>
    );
}

export default Question;