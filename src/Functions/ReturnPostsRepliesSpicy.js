import React, {useState} from 'react';
import firebase, {auth} from './Firebase.js';


const usePostsRepliesSpicy = () => {
    
    const [posts,   setPosts]   = useState(0);
    const [replies, setReplies] = useState(0);
    const [spicy,   setSpicy]   = useState(0);
    
    // Getting user id
    auth.onAuthStateChanged(user => { 
        
        if(user) {
    
            // Getting users posts, replies and spicy
            firebase.database().ref('posts/').on('value', snapshot => { 

                // Capturing data
                var posts = snapshot.val(); 
                var countSpicy = 0;
                var countPosts = 0;
                var countReplies = 0;

                // We sum spicy points of all the posts written by user with ID = uid
                if(posts){

                    Object.keys(posts).map( id => { 

                        // Counting the posts is easy, only increment value by one
                        // Need to mulitply votes by -1, cause negative values on database
                        if(posts[id].userUid === user.uid) {
                            
                            countPosts = countPosts + 1;
                            countSpicy = countSpicy + (posts[id].votes * -1);
                        }
                        
                        // Getting all the replies
                        if(typeof posts[id].replies !== 'undefined'){
                            
                            var replies = posts[id].replies;
                            
                            // Count same way as we did before, increment value by one                      
                            Object.keys(replies).map( id => {
                                
                                if(replies[id].userUid === user.uid){
                                    
                                    countReplies = countReplies + 1;
                                }
                            });
                        }

                    });
                    
                    // Setting the new states
                    setSpicy(countSpicy);
                    setPosts(countPosts);
                    setReplies(countReplies);
                }
            });
        }
    });
        
    return [posts, replies, spicy];
}

export default usePostsRepliesSpicy;