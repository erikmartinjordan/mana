import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetBackgroundImg = (uid) => {
    
    const [imgUrl, setImgUrl] = useState(null)
    
    useEffect( () => { 
        
        if(uid){
            
            let unsubscribe = onValue(ref(db, `users/${uid}/backgroundPic`), snapshot => {
                
                setImgUrl(snapshot.val() || null)
                
            })

            return () => unsubscribe()
            
        }
        
    }, [uid])
    
    return imgUrl
}

export default GetBackgroundImg