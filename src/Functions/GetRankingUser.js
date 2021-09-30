import { useState, useEffect } from 'react'
import { db, onValue, ref }    from './Firebase'

const GetRankingUser = (uid) => {
    
    const [ranking, setRanking] = useState(null)
    
    useEffect(() => { 
        
        let unsubscribe = onValue(ref(db, `users/${uid}/numRanking`), snapshot => { 
            
            let numRanking = snapshot.val() 

            if(numRanking)
                setRanking(`Top ${numRanking}%`)
            
        })
        
        return () => unsubscribe()
        
    }, [uid])
 
    return ranking
}

export default GetRankingUser