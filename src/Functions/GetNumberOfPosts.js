import { useState, useEffect } from 'react';
import firebase                       from './Firebase.js';

const GetNumberOfPosts = (...uids) => {
    
    const [posts, setPosts] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    let stringUids = JSON.stringify(uids);
    
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numPosts = uids.map(uid => ~~users[uid]?.numPosts);
            
            setPosts(numPosts);
            
        });
        
    }, [stringUids]);
    
    return posts;
}

export default GetNumberOfPosts;