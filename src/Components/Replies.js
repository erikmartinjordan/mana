import React, { useEffect, useState }  from 'react';
import { useRef }                      from 'react';
import ReactMarkdown                   from 'react-markdown';
import moment                          from 'moment';
import Linkify                         from 'react-linkify';
import { Link }                        from 'react-router-dom';
import Verified                        from './Verified';
import LikesComments                   from './LikesComments';
import UserAvatar                      from './UserAvatar';
import firebase                        from '../Functions/Firebase';
import EditPost                        from '../Functions/EditPost';
import DeletePost                      from '../Functions/DeletePost';
import GetPoints                       from '../Functions/GetPoints';
import GetLevel                        from '../Functions/GetLevelAndPointsToNextLevel';
import Accounts                        from '../Rules/Accounts';
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
                            <time>{moment(reply.timeStamp).fromNow()}</time>
                        </div>
                    </div> 
                    <div className = 'Content'>
                        <Linkify properties={{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                        <Reply authorId = {reply.userUid} message = {reply.message}/>
                        <div className = 'Meta'>
                            <LikesComments             postId = {postId} replyId = {key} authorId = {reply.userUid}/>
                            <EditPost   type = 'reply' postId = {postId} replyId = {key} authorId = {reply.userUid} admin = {admin} uid = {uid}/>
                            <DeletePost type = 'reply' postId = {postId} replyId = {key} authorId = {reply.userUid} admin = {admin} uid = {uid}/>
                        </div>
                        </Linkify>
                    </div>
                    <div className = 'Info'>
                        {reply.edited ? `Editado: ${moment(reply.edited).calendar()}` : null}
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
    const isAnonymous             = authorId.length === 5;
    
    useEffect( () => {
        
        const fetchUser = async () => {
            
            let snapshot = await firebase.database().ref(`users/${authorId}`).once('value');
            
            let userInfo = snapshot.val();
            
            if(userInfo){
                
                if(userInfo || isAnonymous){
                    
                    setMdFormat(true);
                }
                else{
                    
                    let rangeOfLevels = Object.keys(Accounts['free']);
                    let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level));
                    let canWriteInMd  = Accounts['free'][closestLevel].mdformat ? true : false;
                    
                    setMdFormat(canWriteInMd);
                    
                }
                
            }
            
        }
        
        fetchUser();
        
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
        image:     props => <img src = {props.src} onError = {(e) => e.target.style.display = 'none'} alt = {'Nomoresheet imagen'}></img>
        
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