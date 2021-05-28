import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetBackgroundImg = (uid) => {
    
    const [imgUrl, setImgUrl] = useState(null);
    
    useEffect( () => { 
        
        if(uid){

            let ref = firebase.database().ref(`users/${uid}/backgroundPic`);
            
            let listener = ref.on('value', snapshot => {
               
                let name = snapshot.val();
                
                setImgUrl(name);
                
            });

            return () => ref.off('value', listener);
            
        }
        
    }, [uid]);
    
    return imgUrl;
}

export default GetBackgroundImg;