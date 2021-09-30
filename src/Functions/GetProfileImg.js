import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetProfileImg = (uid) => {
    
    const [imgUrl, setImgUrl] = useState(null)
    
    useEffect( () => { 
        
        if(uid){
            
            onValue(ref(db, `users/${uid}/profilePic`), snapshot => {
                
                setImgUrl(snapshot.val() || null)
                
            }, { onlyOnce: true })
            
        }
        
    }, [uid])
    
    return imgUrl
}

export default GetProfileImg