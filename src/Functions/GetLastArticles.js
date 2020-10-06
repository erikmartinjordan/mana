import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetLastArticles = (userUid, nArticles) => {
    
    const [articles, setArticles] = useState([]);
    
    useEffect(() => { 
        
        if(userUid && nArticles){
           
            firebase.database().ref(`users/${userUid}/lastPosts`).limitToLast(nArticles).on('value', async (snapshot) => { 
                
                let posts = snapshot.val();
                
                if(posts){
                    
                    let postIds  = Object.keys(posts).reverse();
                    
                    let postInfo = await Promise.all(postIds.map(async postId => {
                        
                        let snapshot = await firebase.database().ref(`posts/${postId}/title`).once('value');
                        let title    = snapshot.val();
                        
                        return {url: postId, title: title};
                        
                    }));
                    
                    setArticles(postInfo);
                    
                }
                
            });
            
        }
        
    }, [userUid, nArticles]);
    
    return articles;
    
}

export default GetLastArticles;