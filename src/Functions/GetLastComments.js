import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetLastComments = (numberOfComments) => {
    
    const [comments, setComments] = useState([]);
   
    useEffect( () => {
      
        firebase.database().ref('replies').limitToLast(numberOfComments).on('value', snapshot => { 
            
            let replies = snapshot.val();
            
            if(replies){
                
                let sortedReplies = Object.values(replies).reverse();
                
                setComments(sortedReplies);
                
            } 
            
        });
     
    }, [numberOfComments]);
    
    return comments;
  
}

export default GetLastComments;