import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetNumberOfApplauses = (uid) => {
    
    const [applauses, setApplauses] = useState(0);
    
    useEffect(() => { 
        
        let ref = firebase.database().ref(`users/${uid}/numApplauses`);
        
        let listener = ref.on('value', snapshot => { 
            
            let numApplauses = snapshot.val(); 

            if(numApplauses)
                setApplauses(numApplauses);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [uid]);
    
    return applauses;
    
}

export default GetNumberOfApplauses;