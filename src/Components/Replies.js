import React, { useEffect, useState }  from 'react';
import ReactMarkdown                   from 'react-markdown';
import buildFormatter                  from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                  from 'react-timeago/lib/language-strings/es';
import TimeAgo                         from 'react-timeago';
import Linkify                         from 'react-linkify';
import { Link }                        from 'react-router-dom';
import PublicInfo                      from './PublicInfo.js';
import Verified                        from './Verified.js';
import firebase                        from '../Functions/Firebase.js';
import UserAvatar                      from '../Functions/UserAvatar.js';
import LikesComments                   from '../Functions/LikesComments.js';
import EditPost                        from '../Functions/EditPost';
import DeletePost                      from '../Functions/DeletePost';
import GetPoints                       from '../Functions/GetPoints';
import GetLevel                        from '../Functions/GetLevelAndPointsToNextLevel';
import Accounts                        from '../Rules/Accounts';
import '../Styles/Replies.css';

const formatter = buildFormatter(spanishStrings);

const Replies = ({ admin, postId, uid }) => {
    
    const [replies, setReplies] = useState([]);
    
    useEffect( () => {
        
        firebase.database().ref(`posts/${postId}/replies`).on('value', snapshot => { 
            
            let replies = snapshot.val();
            
            if(replies){
                
                setReplies(replies);
                
            }
            
        });
        
    }, [window.location.href]);
    
    return(
        <div className = 'Replies'>
            {Object.entries(replies).map( ([key, reply], index) => (
                <div className = 'Reply' key = {key}>
                    <div className = 'Header'>
                        <UserAvatar user = {{uid: reply.userUid, photoURL: reply.userPhoto}}/>
                        <div className = 'Author-Name-Date'> 
                            <span className = 'Author-Info'>
                                <Link to = {'/@' + reply.userUid}>{reply.userName}</Link>
                                <PublicInfo uid = {reply.userUid} canvas = {index + 1}/>
                                <Verified   uid = {reply.userUid}/>
                            </span>
                            <TimeAgo formatter = {formatter} date = {reply.timeStamp}/>
                        </div>
                    </div> 
                    <div className = 'Content'>
                        <Linkify properties={{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                        <Reply authorId = {reply.userUid} message = {reply.message}/>
                        <div className = 'Meta'>
                            <LikesComments post = {postId} reply = {key} user = {{uid: reply.userUid}} />
                            <EditPost   type = 'reply' postId = {postId} replyId = {key} authorId = {reply.userUid} admin = {admin} uid = {uid}/>
                            <DeletePost type = 'reply' postId = {postId} replyId = {key} authorId = {reply.userUid} admin = {admin} uid = {uid}/>
                        </div>
                        </Linkify>
                    </div>
                </div>
            ))}
        </div> 
    );
}

export default Replies;

const Reply = ({ authorId, message }) => {
    
    const [mdFormat, setMdFormat] = useState(null);
    const points                  = GetPoints(authorId);
    const level                   = GetLevel(...points)[0];
    
    useEffect( () => {
        
        firebase.database().ref(`users/${authorId}`).on('value', snapshot => {
            
            let userInfo = snapshot.val();
            
            if(userInfo){
                
                if(userInfo.account === 'premium'){
                    
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
        
    }, [level]);
    
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
    
    return <ReactMarkdown source = {message} renderers = {{paragraph: props => <Linkify properties = {linkProperties}><p>{props.children}</p></Linkify>}}/>;
    
}
const NoMarkDownMessage = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'}; 
    
    return message.split("\n").map((text, key) => <Linkify key = {key} properties = {linkProperties}><p>{text}</p></Linkify>)
    
}