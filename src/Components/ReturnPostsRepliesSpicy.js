import React, {useState} from 'react';
import firebase, {auth} from './Firebase.js';


const usePostsRepliesSpicy = () => {
    
    const [posts,   setPosts]   = useState(0);
    const [replies, setReplies] = useState(0);
    const [spicy,   setSpicy]   = useState(0);
    
    // Getting user id
    auth.onAuthStateChanged(user => { 
        
        if(user) {
        
                    // Getting users posts and replies
                    firebase.database().ref('users/' + user.uid).once('value').then( snapshot => { 

                            // Capturing data
                            var capture = snapshot.val(); 

                            if(capture) {

                                // Setting variables
                                if(typeof capture.posts.numPosts !== 'undefined')     setPosts(capture.posts.numPosts);
                                if(typeof capture.replies.numReplies !== 'undefined') setReplies(capture.replies.numReplies);

                            }

                    });
    
    
                    // Getting users spicy
                    firebase.database().ref('posts/').once('value').then( snapshot => { 

                        // Capturing data
                        var posts = snapshot.val(); 
                        var count = 0;

                        // We sum spicy points of all the posts written by user with ID = uid
                        if(posts){

                            Object.keys(posts).map( id => { 

                                // Need to mulitply votes by -1, cause negative values on database
                                if(posts[id].userUid === user.uid) count = count + (posts[id].votes * -1);

                            });
                            
                            setSpicy(count);
                        }
                    });
        }
    });
        
    return [posts, replies, spicy];
}

export default usePostsRepliesSpicy;