import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns the number of chilis (spicy) of a user 
// with a specific userUid
//
//
//--------------------------------------------------------------/
const GetNumberOfSpicy = (...userUids) => {
    
    const [spicy, setSpicy]   = useState([]);

    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('posts/').on('value', snapshot => { 

            // Capturing data
            var posts = snapshot.val();
            
            // Declaring array to count the number of spicy for each user uid
            var countSpicy = new Array(userUids.length).fill(0);

            // We sum spicy points of all the posts written by user with ID = uid
            if(posts){
                
                for(let i = 0; i < userUids.length; i ++){
                    
                        Object.keys(posts).map( id => { 
                            
                            // Counting the posts is easy, only increment value by one
                            if(posts[id].userUid === userUids[i]) countSpicy[i] = countSpicy[i] + 1;
                            
                            
                        });
                }
                
                // Setting spicy
                setSpicy(countSpicy);
            }
        });
        
    }, [JSON.stringify(userUids)]);
        
    return spicy;
}

export default GetNumberOfSpicy;