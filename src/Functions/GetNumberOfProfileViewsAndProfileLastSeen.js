import { useState, useEffect }     from 'react'
import { db, ref, runTransaction } from './Firebase'

const GetNumberOfProfileViewsAndProfileLastSeen = (userUid) => {
    
    const [profileLastSeen, setProfileLastSeen]  = useState(null)
    const [profileViews, setProfileViews]        = useState(0)
    
    useEffect( () => {
        
        if(userUid){
            

            runTransaction(ref(db, `users/${userUid}/profileViews`), value => {

                setProfileViews(value ? value : 0)
                
                return value + 1

            })
            
            runTransaction(ref(db, `users/${userUid}/profileLastSeen`), value => {
                
                setProfileLastSeen(value ? value : 0)
                
                return (new Date()).getTime()
            })
        }
        
    }, [userUid])
    
    return [profileViews, profileLastSeen]
    
}

export default GetNumberOfProfileViewsAndProfileLastSeen