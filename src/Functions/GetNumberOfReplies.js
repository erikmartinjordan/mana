import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetNumberOfReplies = (uid) => {
    
    const [replies, setReplies] = useState(0)
    
    useEffect(() => { 
        
        let unsubscribe = onValue(ref(db, `users/${uid}/numReplies`), snapshot => { 

            setReplies(snapshot.val() || 0)
            
        })
        
        return () => unsubscribe()
        
    }, [uid])
    
    return replies
}

export default GetNumberOfReplies