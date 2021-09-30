import { useState, useEffect }                              from 'react'
import { db, limitToLast, onValue, orderByKey, query, ref } from './Firebase'

const GetLastComments = (numberOfComments) => {
    
    const [comments, setComments] = useState([])
   
    useEffect(() => {
        
        let unsubscribe = onValue(query(ref(db, 'replies'), orderByKey(), limitToLast(numberOfComments)), snapshot => { 
            
            let replies = snapshot.val()
           
            if(replies){
                
                let sortedReplies = Object.entries(replies).reverse()
                
                setComments(sortedReplies)
                
            } 
            
        })
        
        return () => unsubscribe()
     
    }, [numberOfComments])
    
    return comments
  
}

export default GetLastComments