import { useState, useEffect } from 'react';
import firebase                from './Firebase.js';

const GetNumberOfViews = (uid) => {
    
    const [views, setViews] = useState([]);
    
    useEffect(() => { 
        
        let ref = firebase.database().ref(`users/${uid}/numViews`);
        
        let listener = ref.on('value', snapshot => { 
            
            let numViews = snapshot.val(); 

            if(numViews)
                setViews(numViews);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [uid]);
    
    return views;
    
}

export default GetNumberOfViews;