import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetNumberOfSpicy = (...uids) => {
    
    const [spicy, setSpicy] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    let stringUids = JSON.stringify(uids);
    
    useEffect( () => { 
        
        firebase.database().ref('users/').on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numSpicy = uids.map(uid => ~~users[uid]?.numSpicy);
            
            setSpicy(numSpicy);
            
        });
        
    }, [stringUids]);
    
    return spicy;
}

export default GetNumberOfSpicy;