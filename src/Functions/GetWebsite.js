import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetWebsite = (uid) => {
    
    const [web, setWeb] = useState(null)
    
    useEffect( () => { 
        
        if(uid){
            
            let unsubscribe = onValue(ref(db, `users/${uid}/web`), snapshot => {
               
                
                setWeb(snapshot.val() || null)
                
            })

            return () => unsubscribe()
            
        }
        
    }, [uid])
    
    return web
}

export default GetWebsite