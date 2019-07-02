import React from 'react';
import firebase, {auth} from './Firebase.js';

const countVotesRepliesSpicy = async (uid) => {
    
    var posts = 0, replies = 0, spicy = 0;
    
    // Getting users posts and replies
    await firebase.database().ref('users/' + uid).once('value').then( snapshot => { 
            
            // Capturing data
            var capture = snapshot.val(); 
                    
            if(capture) {
                
                // Setting variables
                if(typeof capture.posts.numPosts !== 'undefined') posts = capture.posts.numPosts;
                if(typeof capture.replies.numReplies !== 'undefined') replies = capture.replies.numReplies;
            
            }
                    
      });
    
      // Getting users spicy
      await firebase.database().ref('posts/').once('value').then( snapshot => { 
            
            // Capturing data
            var posts = snapshot.val(); 
                 
            // We sum spicy points of all the posts written by user with ID = uid
            if(posts){
                
                Object.keys(posts).map( id => { 
                     
                    // Need to mulitply votes by -1, cause negative values on database
                    if(posts[id].userUid === uid) spicy = spicy + (posts[id].votes * -1);
                                    
                });
                
            }
          
      });
        
      return [posts, replies, spicy];
}

export default countVotesRepliesSpicy;