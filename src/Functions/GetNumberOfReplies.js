import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns the number of replies of a user 
// with a specific userUid
//
//
//--------------------------------------------------------------/
const GetNumberOfReplies = (userUid) => {
    
    const [replies, setReplies] = useState(0);
    
    // Getting users posts, replies and spicy
    useEffect( () => { 
        firebase.database().ref('posts/').on('value', snapshot => { 
            
            // Capturing data
            var posts = snapshot.val(); 
            var countReplies = 0;
            
            // We sum spicy points of all the posts written by user with ID = uid
            if(posts){
                
                Object.keys(posts).map( id => { 
                    
                    // Getting all the replies
                    if(typeof posts[id].replies !== 'undefined'){
                        
                        var replies = posts[id].replies;
                        
                        // Count same way as we did before, increment value by one                      
                        Object.keys(replies).map( id => {
                            
                            if(replies[id].userUid === userUid){
                                
                                countReplies = countReplies + 1;
                            }
                        });
                    }
                    
                });
                
                // Setting the new states
                setReplies(countReplies);
            }
        });
        
    }, [userUid]);
        
    return replies;
}

export default GetNumberOfReplies;