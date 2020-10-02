import { useState, useEffect } from 'react';
import firebase                       from './Firebase.js';

const GetNumberOfViews = (...uids) => {
    
    const [views, setViews] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    let stringUids = JSON.stringify(uids);
    
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numViews = uids.map( uid => ~~users[uid]?.numViews);
            
            setViews(numViews);
            
        });
        
    }, [stringUids]);
    
    return views;
    
}

export default GetNumberOfViews;