import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase.js';

const GetNumberOfViews = (...userUids) => {
    
    const [views, setViews] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numViews = userUids.map( uid => ~~users[uid]?.numViews);
            
            setViews(numViews);
            
        });
        
    }, [JSON.stringify(userUids)]);
    
    return views;
    
}

export default GetNumberOfViews;