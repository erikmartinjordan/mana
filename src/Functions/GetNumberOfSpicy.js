import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetNumberOfSpicy = (uid) => {
    
    const [spicy, setSpicy] = useState(0)
    
    useEffect(() => { 
        
        let unsubscribe = onValue(ref(db, `users/${uid}/numSpicy`), snapshot => { 

            setSpicy(snapshot.val() || 0)
            
        })
        
        return () => unsubscribe()
        
    }, [uid])
    
    return spicy
}

export default GetNumberOfSpicy