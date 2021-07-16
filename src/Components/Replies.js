import React, { useEffect, useState }  from 'react';
import { useRef }                      from 'react';
import ReactMarkdown                   from 'react-markdown';
import moment                          from 'moment';
import { Link }                        from 'react-router-dom';
import Verified                        from './Verified';
import LikesComments                   from './LikesComments';
import UserAvatar                      from './UserAvatar';
import EditPost                        from './EditPost';
import DeletePost                      from './DeletePost';
import CopyLink                        from './CopyLink';
import Highlight                       from './Highlight';
import firebase                        from '../Functions/Firebase';
import '../Styles/Replies.css';

const Replies = ({ admin, postId, uid }) => {
    
    const [replies, setReplies] = useState([]);
    const replyRef              = useRef();
    const scrollToReplyId       = window.location.href.split('#').pop();
    
    useEffect( () => {
        
        let ref = firebase.database().ref(`posts/${postId}/replies`);
        
        let listener = ref.on('value', snapshot => { 
            
            let replies = snapshot.val();
            
            if(replies){
                
                setReplies(replies);
                
            }
            else{
                
                setReplies([]);
                
            }
            
        });
        
        return () => ref.off('value', listener);
        
    }, [postId]);
    
    useEffect( () => {
        
        if(replyRef.current)
            replyRef.current.scrollIntoView({behavior: 'smooth', block: 'center'});;
        
    });
    
    return(
        <div className = 'Replies'>
            {Object.entries(replies).map( ([key, reply], index) => (
                <div className = {key === scrollToReplyId ? 'Reply Flash' : 'Reply'}  key = {key} ref = {key === scrollToReplyId ? replyRef : null}>
                    <div className = 'Header'>
                        <UserAvatar user = {{uid: reply.userUid, photoURL: reply.userPhoto}}/>
                        <div className = 'Author-Name-Date'> 
                            <span className = 'Author-Info'>
                                <Link to = {'/@' + reply.userUid}>{reply.userName}</Link>
                                <Verified   uid = {reply.userUid}/>
                            </span>
                            <time>{moment(reply.timeStamp).fromNow()} {reply.edited ? `(editado el ${moment(reply.edited).format('DD/MM/YYYY [a las] hh:mm')})` : null}</time>
                        </div>
                    </div> 
                    <div className = 'Content'>
                        <Reply message = {reply.message}/>
                        <div className = 'Meta'>
                            <CopyLink                  postId = {postId} replyId = {key} authorId = {reply.userUid}/>
                            <LikesComments             postId = {postId} replyId = {key} authorId = {reply.userUid}/>
                            <EditPost   type = 'reply' postId = {postId} replyId = {key} authorId = {reply.userUid} admin = {admin} uid = {uid}/>
                            <DeletePost type = 'reply' postId = {postId} replyId = {key} authorId = {reply.userUid} admin = {admin} uid = {uid}/>
                        </div>
                    </div>
                </div>
            ))}
        </div> 
    );
}

export default Replies;

const Reply = ({ message }) => {
    
    const renderers = {
        
        paragraph: props => <Highlight text = {props.children}></Highlight>,
        image:     props => <img src = {props.src} onError = {(e) => e.target.style.display = 'none'} alt = {'Nomoresheet imagen'}></img>,
        table:     props => <div className = 'TableWrap'><table>{props.children}</table></div>
        
    }
    
    return (
        <ReactMarkdown 
            source    = {message} 
            renderers = {renderers}
        />
    );
    
}