import React, { useState, useEffect } from 'react';
import firebase, {auth}               from './Firebase.js';

const GetNumberOfApplauses = (...userUids) => {
    
    const [applauses, setApplauses] = useState([]);

    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numApplauses = userUids.map( uid => ~~users[uid]?.numApplauses);
            
            setApplauses(numApplauses);
            
        });
        
    }, [JSON.stringify(userUids)]);
    
    return applauses;
    
}

export default GetNumberOfApplauses;