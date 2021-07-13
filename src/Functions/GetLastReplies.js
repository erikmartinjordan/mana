import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetLastReplies = (userUid, nReplies) => {
    
    const [replies, setReplies] = useState([]);
    
    useEffect(() => { 
        
        if(userUid && nReplies){
           
            firebase.database().ref(`users/${userUid}/lastReplies`).limitToLast(nReplies).on('value', async (snapshot) => { 
                
                let replies = snapshot.val();
                
                if(replies){
                    
                    let replyIds  = Object.keys(replies).reverse();
                    
                    let replyInfo = await Promise.all(replyIds.map(async replyId => {
                        
                        let postId   = replies[replyId];
                        let snapshot = await firebase.database().ref(`posts/${postId}/title`).once('value');
                        let title    = snapshot.val();
                        
                        return {url: `${postId}/#${replyId}`, title: title};
                        
                    }));
                    
                    setReplies(replyInfo);
                    
                }
                
            });
            
        }
        
    }, [userUid, nReplies]);
    
    return replies;
    
}

export default GetLastReplies;