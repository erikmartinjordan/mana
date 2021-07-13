import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetLastPosts = (userUid, nPosts) => {
    
    const [posts, setPosts] = useState([]);
    
    useEffect(() => { 
        
        if(userUid && nPosts){
           
            firebase.database().ref(`users/${userUid}/lastPosts`).limitToLast(nPosts).on('value', async (snapshot) => { 
                
                let posts = snapshot.val();
                
                if(posts){
                    
                    let postIds  = Object.keys(posts).reverse();
                    
                    let postInfo = await Promise.all(postIds.map(async postId => {
                        
                        let snapshot = await firebase.database().ref(`posts/${postId}/title`).once('value');
                        let title    = snapshot.val();
                        
                        return {url: postId, title: title};
                        
                    }));
                    
                    setPosts(postInfo);
                    
                }
                
            });
            
        }
        
    }, [userUid, nPosts]);
    
    return posts;
    
}

export default GetLastPosts;