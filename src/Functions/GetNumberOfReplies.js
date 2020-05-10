import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase.js';

const GetNumberOfReplies = (...userUids) => {
    
    const [replies, setReplies] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numReplies = userUids.map( uid => ~~users[uid]?.numReplies);
            
            setReplies(numReplies);
            
        });
        
    }, [JSON.stringify(userUids)]);
    
    return replies;
}

export default GetNumberOfReplies;