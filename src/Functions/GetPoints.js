import { useEffect, useState } from 'react';
import firebase                from './Firebase';

const GetPoints = (...uids) => {
    
    const [points, setPoints] = useState([]);

    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    let stringUids = JSON.stringify(uids);
    
    useEffect( () => { 
        
        let ref = firebase.database().ref('users/');
        
        let listener = ref.on('value', snapshot => { 
            
            let users = snapshot.val(); 
            
            let numPoints = JSON.parse(stringUids).map(uid => ~~users[uid]?.numPoints);
            
            setPoints(numPoints);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [stringUids]);
    
    return points;
    
}

export const GetPointsLevel = (level) => {
    
    let points = Math.pow(1.5, level) - 1;
    
    return points;
}

export default GetPoints;