import React, { useState, useEffect } from 'react';
import firebase, {auth}               from './Firebase.js';

const GetLastComments = (numberOfComments) => {
    
    const [comments, setComments] = useState([]);
   
    useEffect( () => {
      
        firebase.database().ref('replies').orderByChild('timeStamp').limitToLast(numberOfComments).on('value', snapshot => { 
            
            let replies = snapshot.val();
            
            if(replies){
                
                let sortedReplies = Object.entries(replies).sort((a,b) => b[1].timeStamp - a[1].timeStamp);
                
                setComments(sortedReplies);
                
            } 
            
        });
     
    }, []);
    
    return comments;
  
}

export default GetLastComments;