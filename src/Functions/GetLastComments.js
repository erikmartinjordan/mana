import React, { useState, useEffect } from 'react';
import firebase, {auth}               from './Firebase.js';

const GetLastComments = (numberOfComments) => {
    
    const [comments, setComments] = useState([]);
   
    useEffect( () => {
      
        firebase.database().ref('replies').limitToLast(numberOfComments).on('value', snapshot => { 
            
            let replies = snapshot.val();
            
            if(replies){
                
                let sortedReplies = Object.entries(replies).reverse();
                
                setComments(sortedReplies);
                
            } 
            
        });
     
    }, []);
    
    return comments;
  
}

export default GetLastComments;