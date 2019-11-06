import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns the number of posts of users with
// a certain userUid
//
//
//--------------------------------------------------------------/
const GetNumberOfPosts = (...userUids) => {
    
    const [posts, setPosts] = useState([]);
    
    // Using JSON.stringify to compare arrays passed as arguments
    // If I don't use it, React will make an infinite render
    useEffect( () => { 
        
        firebase.database().ref('posts/').on('value', snapshot => { 
            
            // Capturing data
            var posts = snapshot.val(); 
            
            // Declaring array to count the number of posts for each user uid
            var countPosts = new Array(userUids.length).fill(0);
            
            // We get all the posts written by a user
            if(posts){
                
                for(let i = 0; i < userUids.length; i ++){

                    Object.keys(posts).map( id => { 
                        
                        // Counting the posts is easy, only increment value by one
                        if(posts[id].userUid === userUids[i]) countPosts[i] = countPosts[i] + 1;
                        
                    });
                    
                }
                
                // Setting posts
                setPosts(countPosts);
                
            }
        });
        
    }, [JSON.stringify(userUids)]);
        
    return posts;
}

export default GetNumberOfPosts;