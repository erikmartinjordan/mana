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
const GetLastArticles = (userUid, nArticles) => {
    
    const [articles, setArticles]   = useState([]);
    
    // Getting users posts
    useEffect( () => { 
        firebase.database().ref('posts/').on('value', snapshot => { 
                
                    // Array of data
                    var array = [];
                    
                    // Capturing data
                    var posts = snapshot.val();

                    // We look the posts written by user with ID = uid
                    if(posts){

                        Object.keys(posts).map( id => { 

                            // Pushing the post to the array
                            if(posts[id].userUid === userUid) array.push({'title': posts[id].title, 'url': id});

                        });
                        
                        // Setting posts
                        setArticles(array);
                    }
        });
        
    }, [userUid]);
                
    return articles.reverse().slice(0, nArticles);
}

export default GetLastArticles;