import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns the number of applauses of a user 
// with a specific userUid
//
//
//--------------------------------------------------------------/
const GetNumberOfApplauses = (...userUids) => {
    
    const [applauses, setApplauses]   = useState([]);

    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('posts/').on('value', snapshot => { 
            
            // Capturing data
            var posts = snapshot.val(); 
            
            // Declaring array to count the number of replies for each user uid
            var countApplauses = new Array(userUids.length).fill(0);
            
            // We sum spicy points of all the posts written by user with ID = uid
            if(posts){
                
                for(let i = 0; i < userUids.length; i ++){
                
                    Object.keys(posts).map( id => { 

                        // Getting all the replies
                        if(typeof posts[id].replies !== 'undefined'){

                            var replies = posts[id].replies;

                            // Count same way as we did before                      
                            Object.keys(replies).map( id => {

                                if(replies[id].userUid === userUids[i] && replies[id].voteUsers){

                                    countApplauses[i] = countApplauses[i] + Object.keys(replies[id].voteUsers).length;
                                }
                            });
                        }

                    });
                    
                }
                
                // Setting the new states
                setApplauses(countApplauses);
            }
        });
        
    }, [JSON.stringify(userUids)]);
        
    return applauses;
}

export default GetNumberOfApplauses;