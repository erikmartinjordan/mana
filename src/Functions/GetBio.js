import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetBackgroundImg = (uid) => {
    
    const [bio, setBio] = useState(null);
    
    useEffect( () => { 
        
        if(uid){

            let ref = firebase.database().ref(`users/${uid}/bio`);
            
            let listener = ref.on('value', snapshot => {
               
                let bio = snapshot.val();
                
                setBio(bio);
                
            });

            return () => ref.off('value', listener);
            
        }
        
    }, [uid]);
    
    return bio;
}

export default GetBackgroundImg;