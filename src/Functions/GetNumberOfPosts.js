import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase.js';

const GetNumberOfPosts = (...userUids) => {
    
    const [posts, setPosts] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numPosts = userUids.map( uid => ~~users[uid]?.numPosts);
            
            setPosts(numPosts);
            
        });
        
    }, [JSON.stringify(userUids)]);
    
    return posts;
}

export default GetNumberOfPosts;