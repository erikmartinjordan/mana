import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns the lasts comments posted
//
//
//--------------------------------------------------------------/
const GetLastComments = () => {
    
    const [replies, setReplies] = useState(null);
   
    useEffect( () => {
        
        var res = [];
        var sorted = [];
        var content = [];
          
        !replies && firebase.database().ref('posts/').on('value', snapshot => { 
            
            // Capturing data
            var posts = snapshot.val(); 
            
            // We get all the posts
            if(posts){
                Object.keys(posts).map( pid => { 
                    
                    // Getting all the replies
                    if(typeof posts[pid].replies !== 'undefined'){
                        
                        var replies = posts[pid].replies;
                        
                        // Getting pid, rid, author and timeStamp                   
                        Object.keys(replies).map( rid => {
                               
                            var object = {
                                'pid': pid,
                                'rid': rid,
                                'author': replies[rid].userName,
                                'userPhoto': replies[rid].userPhoto,
                                'claps': replies[rid].voteUsers ? Object.keys(replies[rid].voteUsers).length : 0,
                                'timeStamp': replies[rid].timeStamp
                            }
                            
                            res.push(object)
                            
                        });
                    }
                });
            }
            
            // Sorting res by timeStamp and sliced by number of comments
            sorted = res.sort( (a, b) => b.timeStamp - a.timeStamp );
            
            // Setting state
            setReplies(sorted);
            
        });
        
        // Drawing emojies in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
                  
    }, [replies]);
            
    return replies;
          
}

export default GetLastComments;