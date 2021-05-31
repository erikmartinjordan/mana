import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetCity = (uid) => {
    
    const [city, setCity] = useState(null);
    
    useEffect( () => { 
        
        if(uid){

            let ref = firebase.database().ref(`users/${uid}/city`);
            
            let listener = ref.on('value', snapshot => {
               
                let city = snapshot.val();
                
                setCity(city);
                
            });

            return () => ref.off('value', listener);
            
        }
        
    }, [uid]);
    
    return city;
}

export default GetCity;