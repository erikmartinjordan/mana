import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

const GetNumberOfViews = (uid) => {
    
    const [views, setViews] = useState(0);
    
    useEffect( () => { 
        
        if(uid){
            
            firebase.database().ref('posts/').on('value', snapshot => { 
               
                let posts = snapshot.val(); 
                
                if(posts){
                    
                    let userPosts = Object.values(posts).filter(post => {
                        
                        let { replies = {}, userUid } = post;
                        
                        return post.userUid === uid || Object.values(replies).some(reply => reply.userUid === uid);
                        
                    });
                    
                    let totalViews = userPosts.reduce( (total, post) => total = total + post.views, 0); 
                    
                    setViews(totalViews);
                }
               
            });
            
        }
        
    }, [uid]);
    
    return views;
    
}

export default GetNumberOfViews;