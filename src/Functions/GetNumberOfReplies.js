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
const GetNumberOfReplies = (...userUids) => {
    
    const [replies, setReplies] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('posts/').on('value', snapshot => { 
            
            // Capturing data
            var posts = snapshot.val(); 
            
            // Declaring array to count the number of replies for each user uid
            var countReplies = new Array(userUids.length).fill(0);
            
            // We sum spicy points of all the posts written by user with ID = uid
            if(posts){
                
                for(let i = 0; i < userUids.length; i ++){
                
                    Object.keys(posts).map( id => { 

                        // Getting all the replies
                        if(typeof posts[id].replies !== 'undefined'){

                            var replies = posts[id].replies;

                            // Count same way as we did before, increment value by one                      
                            Object.keys(replies).map( id => {

                                if(replies[id].userUid === userUids[i]){

                                    countReplies[i] = countReplies[i] + 1;
                                }
                            });
                        }

                    });
                    
                }
                
                // Setting the new states
                setReplies(countReplies);
            }
        });
        
    }, [JSON.stringify(userUids)]);
        
    return replies;
}

export default GetNumberOfReplies;