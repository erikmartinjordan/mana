import { useEffect, useState } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetPoints = (uid) => {
    
    const [points, setPoints] = useState(0)
    
    useEffect(() => {
        
        let unsubscribe = onValue(ref(db, `users/${uid}/numPoints`), snapshot => { 
            
            setPoints(snapshot.val() || 0)
    
        })
        
        return () => unsubscribe()
        
    }, [uid])
    
    return points
    
}

export const GetPointsLevel = (level) => {
    
    let points = Math.pow(1.5, level) - 1
    
    return points
}

export default GetPoints