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
    
    return(
        <div className = 'Replies'>
            {Object.keys(replies).map( (key, index) => (
                <div className = 'Reply' key = {key}>
                    <div className = 'Header'>
                        <UserAvatar user = {{uid: replies[key].userUid, photoURL: replies[key].userPhoto}}/>
                        <div className = 'Author-Name-Date'> 
                            <span className = 'Author-Info'>
                                <Link to = {'/@' + replies[key].userUid}>{replies[key].userName}</Link>
                                <PublicInfo uid = {replies[key].userUid} canvas = {index + 1}/>
                                <Verified   uid = {replies[key].userUid}/>
                            </span>
                            <TimeAgo formatter = {formatter} date = {replies[key].timeStamp}/>
                        </div>
                    </div> 
                    <div className = 'Content'>
                        <Linkify properties={{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                            { isPremiumUser(replies[key].userUid)
                            ? <ReactMarkdown source = {replies[key].message}/> 
                            : replies[key].message.split('\n').map((text, key) => <p key = {key}>{text}</p>)
                            }
                            <div className = 'Meta'>
                                <LikesComments post = {props.postId} reply = {key} user = {{uid: replies[key].userUid}} />
                                {props.admin && <EditPost   type = 'reply' post = {props.postId} reply = {key} />}
                                {props.admin && <DeletePost type = 'reply' post = {props.postId} reply = {key} />}
                            </div>
                        </Linkify>
                    </div>
                </div>
            ))}
        </div> 
        
    );
}

export default Replies;