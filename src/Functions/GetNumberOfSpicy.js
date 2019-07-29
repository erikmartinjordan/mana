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
const GetNumberOfSpicy = (userUid) => {
    
    const [spicy, setSpicy]   = useState(0);

    // Getting users posts
    useEffect( () => { 
        firebase.database().ref('posts/').on('value', snapshot => { 

                    // Capturing data
                    var posts = snapshot.val(); 
                    var countSpicy = 0;

                    // We sum spicy points of all the posts written by user with ID = uid
                    if(posts){

                        Object.keys(posts).map( id => { 

                            // Counting the posts is easy, only increment value by one
                            if(posts[id].userUid === userUid) countSpicy = countSpicy + 1;

                            // Setting posts
                            setSpicy(countSpicy);
                        });
                    }
        });
        
    }, [userUid]);
        
    return spicy;
}

export default GetNumberOfSpicy;