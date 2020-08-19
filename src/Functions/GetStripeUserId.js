import React, { useState, useEffect } from 'react';
import firebase                       from './Firebase.js';

const GetStripeUserId = (uid) => {
    
    const [stripeUserId, setStripeUserId] = useState(null);
   
    useEffect( () => {
      
        firebase.database().ref(`users/${uid}/stripeUserId`).on('value', snapshot => { 
            
            setStripeUserId(snapshot.val());
            
        });
     
    }, []);
    
    return stripeUserId;
  
}

export default GetStripeUserId;