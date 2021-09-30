import { useState, useEffect } from 'react'
import { db, get, onValue }    from './Firebase'

const GetName = (uid) => {
    
    const [userName, setUserName] = useState(null)

    useEffect( () => { 
        
        if(uid){
            
            onValue(ref(db, `users/${uid}/name`), snapshot => {
               
                let name = snapshot.val()
                
                setUserName(snapshot.val() || null)
                
            }, { onlyOnce: true })
            
        }
        
    }, [uid])
    
    return userName
    
}

export default GetName