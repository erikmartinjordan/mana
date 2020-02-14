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
import '../Styles/Replies.css';

const formatter = buildFormatter(spanishStrings);

const Replies = (props) => {
    
    const [replies, setReplies] = useState([]);
    
    useEffect( () => {
        
        firebase.database().ref(`posts/${props.postId}/replies`).on('value', snapshot => { 
            
            let replies = snapshot.val();
            
            if(replies){
                
                setReplies(replies);
                
            }
            
        });
        
    }, [window.location.href]);
    
    const isPremiumUser = async (uid) => {
        
        let snapshot = await firebase.database().ref(`users/${uid}`).once('value');
        
        let userInfo = snapshot.val();
        
        return userInfo && userInfo.account === 'premium' ? true : false;
        
    }
    
    const canEditDelete = (replyUid) => {
        
        return props.admin || (isPremiumUser(props.uid) && props.uid === replyUid);
        
    }
    
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
                        { isPremiumUser(reply.userUid)
                        ? <MarkDownMessage   message = {reply.message}/>
                        : <NoMarkDownMessage message = {reply.message}/>
                        }
                        <div className = 'Meta'>
                            <LikesComments post = {props.postId} reply = {key} user = {{uid: reply.userUid}} />
                            {canEditDelete(reply.userUid) && <EditPost   type = 'reply' post = {props.postId} reply = {key} />}
                            {canEditDelete(reply.userUid) && <DeletePost type = 'reply' post = {props.postId} reply = {key} />}
                        </div>
                        </Linkify>
                    </div>
                </div>
            ))}
        </div> 
        
    );
}

export default Replies;

const MarkDownMessage   = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'};
    
    return <ReactMarkdown source = {message} renderers = {{paragraph: props => <Linkify properties = {linkProperties}>{props.children}</Linkify>}}/>;
    
}
const NoMarkDownMessage = ({ message }) => {
    
    const linkProperties = {target: '_blank', rel: 'nofollow noopener noreferrer'}; 
    
    return message.split("\n").map((text, key) => <Linkify properties = {linkProperties}><p key = {key}>{text}</p></Linkify>)
    
}