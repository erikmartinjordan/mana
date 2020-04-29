import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase.js';

const GetNumberOfSpicy = (...userUids) => {
    
    const [spicy, setSpicy] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numSpicy = userUids.map( uid => ~~users[uid]?.numSpicy);
            
            setSpicy(numSpicy);
            
        });
        
    }, [JSON.stringify(userUids)]);
    
    return spicy;
}

export default GetNumberOfSpicy;