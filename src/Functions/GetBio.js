import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetBackgroundImg = (uid) => {
    
    const [bio, setBio] = useState(null)
    
    useEffect( () => { 
        
        if(uid){
            
            let unsubscribe = onValue(ref(db, `users/${uid}/bio`), snapshot => {
                               
                setBio(snapshot.val() || null)
                
            })

            return () => unsubscribe()
            
        }
        
    }, [uid])
    
    return bio
}

export default GetBackgroundImg