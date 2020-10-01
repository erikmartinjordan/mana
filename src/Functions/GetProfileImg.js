import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase';

const GetProfileImg = (uid) => {
    
    const [imgUrl, setImgUrl] = useState(null);
    
    useEffect( () => { 
        
        if(uid){
            
            firebase.database().ref(`users/${uid}/profilePic`).once('value').then(snapshot => {
               
                let name = snapshot.val();
                
                setImgUrl(name);
                
            });
            
        }
        
    }, [uid]);
    
    return imgUrl;
}

export default GetProfileImg;