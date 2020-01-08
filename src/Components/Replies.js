import React, { useEffect, useState }  from 'react';
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
    
    return(
        <div className = 'Replies'>
            {Object.keys(replies).map( (key, index) => (
                <div className = 'Reply' key = {key}>
                    <div className = 'Infopost'>
                        <UserAvatar user = {{uid: replies[key].userUid, photoURL: replies[key].userPhoto}}/>
                        <div className = 'Group'> 
                            <span className = 'user-verified'>
                                <Link to = {'/@' + replies[key].userUid}>{replies[key].userName}</Link>
                                <PublicInfo uid = {replies[key].userUid} canvas = {index + 1}/>
                                <Verified   uid = {replies[key].userUid}/>
                            </span>
                            <TimeAgo formatter = {formatter} date = {replies[key].timeStamp}/>
                        </div>
                    </div> 
                    <Linkify properties={{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                        {replies[key].message.split('\n').map((text, key) => <p key = {key}>{text}</p>)}
                        <div className = 'Meta-Post'>
                            <LikesComments post = {props.postId} reply = {key} user = {{uid: replies[key].userUid}} />
                            {props.admin && <EditPost   type = 'reply' post = {props.postId} reply = {key} />}
                            {props.admin && <DeletePost type = 'reply' post = {props.postId} reply = {key} />}
                        </div>
                    </Linkify>
                </div>
            ))}
        </div> 
        
    );
}

export default Replies;