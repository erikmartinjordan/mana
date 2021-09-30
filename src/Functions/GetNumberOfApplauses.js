import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetNumberOfApplauses = (uid) => {
    
    const [applauses, setApplauses] = useState(0)
    
    useEffect(() => { 
                
        let unsubscribe = onValue(ref(db, `users/${uid}/numApplauses`), snapshot => { 

            setApplauses(snapshot.val() || 0)
            
        })
        
        return () => unsubscribe()
        
    }, [uid])
    
    return applauses
    
}

export default GetNumberOfApplauses