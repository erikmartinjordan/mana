import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetLastComments = (numberOfComments) => {
    
    const [comments, setComments] = useState([]);
   
    useEffect( () => {
        
        let ref = firebase.database().ref('replies');
      
        let listener = ref.orderByKey().limitToLast(numberOfComments).on('value', snapshot => { 
            
            let replies = snapshot.val();
           
            if(replies){
                
                let sortedReplies = Object.entries(replies).reverse();
                
                setComments(sortedReplies);
                
            } 
            
        });
        
        return () => ref.off('value', listener);
     
    }, [numberOfComments]);
    
    return comments;
  
}

export default GetLastComments;