import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetNumberOfPosts = (uid) => {
    
    const [posts, setPosts] = useState(0);
    
    useEffect(() => { 
        
        let ref = firebase.database().ref(`users/${uid}/numPosts`);
        
        let listener = ref.on('value', snapshot => { 
            
            let numPosts = snapshot.val(); 

            if(numPosts)
                setPosts(numPosts);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [uid]);
    
    return posts;
}

export default GetNumberOfPosts;