import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetNumberOfPosts = (uid) => {
    
    const [posts, setPosts] = useState(0)
    
    useEffect(() => { 
        
        let unsubscribe = onValue(ref(db, `users/${uid}/numPosts`), snapshot => { 

            setPosts(snapshot.val() || 0)
            
        })
        
        return () => unsubscribe()
        
    }, [uid])
    
    return posts
}

export default GetNumberOfPosts