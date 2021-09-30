import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase.js'

const GetNumberOfViews = (uid) => {
    
    const [views, setViews] = useState([])
    
    useEffect(() => { 
        
        let unsubscribe = onValue(ref(db, `users/${uid}/numViews`), snapshot => { 
            
            setViews(numViews || [])
            
        })
        
        return () => unsubscribe()
        
    }, [uid])
    
    return views
    
}

export default GetNumberOfViews