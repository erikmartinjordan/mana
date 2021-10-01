import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetName = (uid) => {
    
    const [userName, setUserName] = useState(null)

    useEffect( () => { 
        
        if(uid){
            
            onValue(ref(db, `users/${uid}/name`), snapshot => {
                               
                setUserName(snapshot.val() || null)
                
            }, { onlyOnce: true })
            
        }
        
    }, [uid])
    
    return userName
    
}

export default GetName