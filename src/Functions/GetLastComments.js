import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

const GetLastComments = (numberOfComments) => {
    
    const [comments, setComments] = useState([]);
   
    useEffect( () => {
      
        firebase.database().ref('posts/').on('value', snapshot => { 
            
            var posts = snapshot.val(); 
            
            if(posts){
                
                let postsWithReplies = Object.entries(posts).map( ([postId, {replies}]) => {
                    
                    if(replies){
                        
                        let repliesWithPostIdAndReplyId = Object.entries(replies).map( ([replyId, reply]) => ({...reply, 'postId': postId, 'replyId': replyId}) );
                        
                        return repliesWithPostIdAndReplyId;
                        
                    }
                    
                });
                
                let flatReplies = postsWithReplies.flat(Infinity).filter(elem => elem ? true : false);
                
                let sortedReplies = flatReplies.sort((a, b) => b.timeStamp - a.timeStamp);
                
                setComments(sortedReplies);
                
            }
            
        });
     
    }, []);
    
    return comments.slice(0, numberOfComments);
  
}

export default GetLastComments;