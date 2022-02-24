import { useEffect, useState } from 'react'
import { db, onValue, ref } from '../Functions/Firebase'
import Accounts from '../Rules/Accounts'

const GetLevel = (uid) => {
    
    const [level, setLevel] = useState([0, 0, 0])
    
    useEffect(() => {
        
        let unsubscribe = onValue(ref(db, `users/${uid}/numPoints`), snapshot => { 
            
            let points = snapshot.val() || 0

            // numb = log1.5(points + 1)
            // level = floor(log1.5(points + 1))
            let numb  = Math.log(points + 1) / Math.log(1.5)
            let level = Math.floor(numb)
            
            let nextLevel  = level + 1
            let pointsLevelDown = Math.pow(1.5, level) - 1
            let pointsLevelUp = Math.pow(1.5, nextLevel) - 1
            let pointsToNextLevel = Math.ceil(pointsLevelUp - points)
            
            let percentage = Math.floor(100 * (points - pointsLevelDown) / (pointsLevelUp - pointsLevelDown))

            setLevel(isNaN(level) ? [0, 0, 0] : [level, pointsToNextLevel, percentage])
    
        })
        
        return () => unsubscribe()
        
    }, [uid])
    
    return level
    
}

export default GetLevel

export const GetClosestLevel = (uid) => {

    let level = GetLevel(uid)[0]
    
    let rangeOfLevels = Object.keys(Accounts['free'])
    let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level))
    
    return closestLevel
    
}