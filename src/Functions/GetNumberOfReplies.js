import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetNumberOfReplies = (uid) => {
    
    const [replies, setReplies] = useState([]);
    
    useEffect(() => { 
        
        let ref = firebase.database().ref(`users/${uid}/numReplies`);
        
        let listener = ref.on('value', snapshot => { 
            
            let numReplies = snapshot.val(); 

            if(numReplies)
                setReplies(numReplies);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [uid]);
    
    return replies;
}

export default GetNumberOfReplies;