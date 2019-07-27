import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns the number of posts of a user 
// with a specific userUid
//
//
//--------------------------------------------------------------/
const GetNumberOfPosts = (userUid) => {
    
    const [posts, setPosts]   = useState(0);

    // Getting users posts
    useEffect( () => { 
        firebase.database().ref('posts/').on('value', snapshot => { 

                    // Capturing data
                    var posts = snapshot.val(); 
                    var countPosts = 0;

                    // We sum spicy points of all the posts written by user with ID = uid
                    if(posts){

                        Object.keys(posts).map( id => { 

                            // Counting the posts is easy, only increment value by one
                            if(posts[id].userUid === userUid) countPosts = countPosts + 1;

                            // Setting posts
                            setPosts(countPosts);
                        });
                    }
        });
        
    }, []);
        
    return posts;
}

export default GetNumberOfPosts;