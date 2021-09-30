import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase.js'

const GetStripeUserId = (uid) => {
    
    const [stripeUserId, setStripeUserId] = useState(null)
   
    useEffect( () => {
      
        let unsubscribe = onValue(ref(db, `users/${uid}/stripeUserId`), snapshot => { 
            
            setStripeUserId(snapshot.val() || null)
            
        })

        return () => unsubscribe()
     
    }, [uid])
    
    return stripeUserId
  
}

export default GetStripeUserId