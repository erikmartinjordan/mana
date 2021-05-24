import { useEffect, useState } from 'react';
import firebase                from './Firebase';

const GetPoints = (uid) => {
    
    const [points, setPoints] = useState(0);
    
    useEffect(() => { 
        
        let ref = firebase.database().ref(`users/${uid}/numPoints`);
        
        let listener = ref.on('value', snapshot => { 
            
            let numPoints = snapshot.val(); 

            if(numPoints)
                setPoints(numPoints);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [uid]);
    
    return points;
    
}

export const GetPointsLevel = (level) => {
    
    let points = Math.pow(1.5, level) - 1;
    
    return points;
}

export default GetPoints;