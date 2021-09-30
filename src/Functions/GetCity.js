import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetCity = (uid) => {
    
    const [city, setCity] = useState(null)
    
    useEffect( () => { 
        
        if(uid){
            
            let unsubscribe = onValue(ref(db, `users/${uid}/city`), snapshot => {
                               
                setCity(snapshot.val() || null)
                
            })

            return () => unsubscribe()
            
        }
        
    }, [uid])
    
    return city
}

export default GetCity