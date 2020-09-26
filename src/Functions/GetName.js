import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase';

const GetName = (uid) => {
    
    const [userName, setUserName] = useState(null);

    useEffect( () => { 
        
        if(uid){
            
            firebase.database().ref(`users/${uid}/name`).once('value').then(snapshot => {
               
                let name = snapshot.val();
                
                setUserName(name);
                
            });
            
        }
        
    }, [uid]);
    
    return userName;
    
}

export default GetName;