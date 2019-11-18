import React, { useState, useEffect }   from 'react';
import GetNumberOfPosts                 from './GetNumberOfPosts.js';
import GetNumberOfReplies               from './GetNumberOfReplies.js';
import GetNumberOfSpicy                 from './GetNumberOfSpicy.js';
import GetNumberOfApplauses             from './GetNumberOfApplauses.js';
import GetPoints                        from './GetPoints.js';
import firebase                         from './Firebase.js';

//--------------------------------------------------------------/
//
// This functions returns list of users ordered by points
//
//
//--------------------------------------------------------------/
const GetRankingUser = (userUid) => {
    
    // Declaring users
    const [users, setUsers] = useState([]);

    // Getting if user is verified
    useEffect( () => { 
        
        firebase.database().ref('users/').once('value').then( snapshot => {
                
            if(snapshot) {
                
                let userUids = Object.keys(snapshot.val());
                setUsers(userUids);
                
            }
        }) 
        
    }, []);
        
    // Getting the number of points
    // If I don't do optional spreading, I get error, because
    // initial state of users is null
    const points = GetPoints(...users);
    
    // Array of users and points
    const array = users.map( (_, i) => [users[i], points[i]] );
        
    // Sorting array by points
    const sorted = array.sort( (a, b) => a[1] > b[1] ? -1 : 1);
    
    // Getting first position of sorted array -> userUids
    const sortedUids = sorted.map(array => array[0]);
    
    // Getting the index of the user
    const index = sortedUids.indexOf(userUid);
    
    // Ranking
    let rank = ( (index + 1) / users.length);
    
    // Generating res
    var res = (isFinite(rank) && rank > 0 && rank < 0.3) ? `top ${Math.round(rank * 100)} %` : null ;
 
    return res ;
}

export default GetRankingUser;