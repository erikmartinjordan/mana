import { useState, useEffect }   from 'react';
import GetPoints                 from './GetPoints';
import firebase                  from './Firebase';

const GetRankingUser = (userUid) => {
    
    const [users, setUsers] = useState([]);
    
    useEffect( () => { 
        
        firebase.database().ref('users/').once('value').then( snapshot => {
            
            if(snapshot) {
                
                let userUids = Object.keys(snapshot.val());
                setUsers(userUids);
                
            }
        }) 
        
    }, []);
    
    const points = GetPoints(...users);
    
    const array = users.map( (_, i) => [users[i], points[i]] );
    
    const sorted = array.sort( (a, b) => a[1] > b[1] ? -1 : 1);
    
    const sortedUids = sorted.map(array => array[0]);
    
    const index = sortedUids.indexOf(userUid);
    
    let rank = ( (index + 1) / users.length);
    
    var res = (isFinite(rank) && rank > 0 && rank < 0.3) ? `top ${Math.round(rank * 100)} %` : null ;
 
    return res ;
}

export default GetRankingUser;