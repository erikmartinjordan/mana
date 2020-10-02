import { useState, useEffect } from 'react';
import firebase                from './Firebase.js';

const GetNumberOfApplauses = (...uids) => {
    
    const [applauses, setApplauses] = useState([]);

    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    let stringUids = JSON.stringify(uids);
    
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numApplauses = uids.map(uid => ~~users[uid]?.numApplauses);
            
            setApplauses(numApplauses);
            
        });
        
    }, [stringUids]);
    
    return applauses;
    
}

export default GetNumberOfApplauses;