import { useState, useEffect }   from 'react';
import GetPoints                 from './GetPoints';
import firebase                  from './Firebase';

const GetRankingUser = (uid) => {
    
    const [ranking, setRanking] = useState(null);
    
    useEffect(() => { 
        
        let ref = firebase.database().ref(`users/${uid}/numRanking`);
        
        let listener = ref.on('value', snapshot => { 
            
            let numRanking = snapshot.val(); 

            if(numRanking)
                setRanking(`Top ${numRanking}%`);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [uid]);
 
    return ranking;
}

export default GetRankingUser;