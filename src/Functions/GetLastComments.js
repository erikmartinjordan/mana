import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

const GetLastComments = (numberOfComments) => {
    
    const [replies, setReplies] = useState([]);
   
    useEffect( () => {
      
        firebase.database().ref('posts/').on('value', snapshot => { 
            
            var res = [];
            var sorted = [];
            var content = [];
            
            var posts = snapshot.val(); 
            
            if(posts){
                Object.keys(posts).map( pid => { 
                    
                    if(typeof posts[pid].replies !== 'undefined'){
                        
                        var replies = posts[pid].replies;
                        
                        Object.keys(replies).map( rid => {
                               
                            var object = {
                                'pid': pid,
                                'rid': rid,
                                'author': replies[rid].userName,
                                'userPhoto': replies[rid].userPhoto,
                                'userUid': replies[rid].userUid,
                                'claps': replies[rid].voteUsers ? Object.keys(replies[rid].voteUsers).length : 0,
                                'timeStamp': replies[rid].timeStamp
                            }
                            
                            res.push(object)
                            
                        });
                    }
                });
            }
            
            sorted = res.sort( (a, b) => b.timeStamp - a.timeStamp );
            
            setReplies(sorted);
            
        });
     
    }, []);
        
    return replies.slice(0, numberOfComments);
  
}

export default GetLastComments;