import React, {useState} from 'react';
import firebase, {auth} from './Firebase.js';


const VotesRepliesSpicy = (uid, children) =>{
    
    var array = useVotresRepliesSpicy(uid);
    return children(array);
}

export default countVotesRepliesSpicy;


const useVotesRepliesSpicy = (uid) => {
    
    const [posts,   setPosts]   = useState(0);
    const [replies, setReplies] = useState(0);
    const [spicy,   setSpicy]   = useState(0);
    
    // Getting users posts and replies
    firebase.database().ref('users/' + uid).once('value').then( snapshot => { 
            
            // Capturing data
            var capture = snapshot.val(); 
                    
            if(capture) {
                
                // Setting variables
                if(typeof capture.posts.numPosts !== 'undefined')     setPosts(capture.posts.numPosts);
                if(typeof capture.replies.numReplies !== 'undefined') setReplies(capture.replies.numReplies);
            
            }
                    
      });
    
      console.log(posts);
      console.log(replies);
    
      // Getting users spicy
      firebase.database().ref('posts/').once('value').then( snapshot => { 
            
            // Capturing data
            var posts = snapshot.val(); 
                 
            // We sum spicy points of all the posts written by user with ID = uid
            if(posts){
                
                Object.keys(posts).map( id => { 
                     
                    // Need to mulitply votes by -1, cause negative values on database
                    if(posts[id].userUid === uid) setSpicy(spicy + (posts[id].votes * -1) );
                                    
                });
                
            }
          
      });
    
      console.log(spicy);
        
      return [posts, replies, spicy];
}

export default useVotesRepliesSpicy;