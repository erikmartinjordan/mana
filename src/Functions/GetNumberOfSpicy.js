import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetNumberOfSpicy = (uid) => {
    
    const [spicy, setSpicy] = useState(0);
    
    useEffect(() => { 
        
        let ref = firebase.database().ref(`users/${uid}/numSpicy`);
        
        let listener = ref.on('value', snapshot => { 
            
            let numSpicy = snapshot.val(); 

            if(numSpicy)
                setSpicy(numSpicy);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [uid]);
    
    return spicy;
}

export default GetNumberOfSpicy;