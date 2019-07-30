import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns the name of a user 
// with a specific userUid
//
//
//--------------------------------------------------------------/
const GetName = (userUid) => {
    
    const [name, setName]   = useState(null);

    // Getting users posts
    useEffect( () => { 
        firebase.database().ref('posts/').on('value', snapshot => { 

                    // Capturing data
                    var posts = snapshot.val(); 

                    // We sum spicy points of all the posts written by user with ID = uid
                    if(posts){

                        Object.keys(posts).map( id => { 

                            // Counting the posts is easy, only increment value by one
                            if(posts[id].userUid === userUid) setName(posts[id].userName);
                            
                            // Getting all the replies
                            if(typeof posts[id].replies !== 'undefined'){

                                var replies = posts[id].replies;

                                // Count same way as we did before, increment value by one                      
                                Object.keys(replies).map( id => {

                                    if(replies[id].userUid === userUid) setName(replies[id].userName);
                                });
                            }
                            
                        });
                    }
                
        });
        
    }, [userUid]);
        
    return name;
}

export default GetName;