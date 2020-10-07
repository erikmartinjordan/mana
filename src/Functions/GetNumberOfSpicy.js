import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetNumberOfSpicy = (...uids) => {
    
    const [spicy, setSpicy] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    let stringUids = JSON.stringify(uids);
    
    useEffect( () => { 
        
        let ref = firebase.database().ref('users/');
        
        let listener = ref.on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numSpicy = JSON.parse(stringUids).map(uid => ~~users[uid]?.numSpicy);
            
            setSpicy(numSpicy);
            
        });
      
        return () => ref.off('value', listener);
        
    }, [stringUids]);
    
    return spicy;
}

export default GetNumberOfSpicy;