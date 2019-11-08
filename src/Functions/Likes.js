import React, { useState, useEffect }   from 'react';
import firebase                         from './Firebase.js';
import nmsNotification                  from './InsertNotificationIntoDatabase.js';
import Login                            from '../Components/Login';

const Likes = (props) => {  
    
    const [capture, setCapture] = useState(null);
    const [forbid, setForbid]   = useState(false);
    const [render, setRender]   = useState(false);
    const [userid, setUserid]   = useState(null);
    const [votes, setVotes]     = useState(0);
        
    useEffect( () => {
    
        // Component is mounted
        let mounted = true;
        
        firebase.database().ref('posts/' + props.post).on('value', snapshot => { 

            var capture = snapshot.val();            
            
            if(capture && mounted) {
                
                let uid   = capture.userUid;
                let votes = capture.voteUsers ? Object.keys(capture.voteUsers).length : 0;
                
                setCapture(capture);
                setUserid(uid);
                setVotes(votes);
            }
            
        });
        
        // Unmounting component
        return () => {mounted = false};
        
    },[]);
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} ) 
        
    });
    
    const handleVote = async (e) => {
        
        // Capturing likes object
        let capture = await firebase.database().ref('posts/' + props.post + '/voteUsers/').once('value');
        
        // Getting the fingerprint of the users
        let users = capture.val() ? Object.keys(capture.val()) : [];
        
        // If user liked the post already, remove the branch
        // In other case, add it
        users.indexOf(userid) === -1
        ? firebase.database().ref('posts/' + props.post + '/voteUsers/' + props.user.uid).transaction( value => true)
        : firebase.database().ref('posts/' + props.post + '/voteUsers/' + props.user.uid).remove();
        
        // Sending notification to user
        users.indexOf(userid) === -1
        ? nmsNotification(userid, 'chili', 'add')
        : nmsNotification(userid, 'chili', 'sub');
        
    }
    
    return (
      <div className = 'Likes'>
            <div className = 'votes'>
                <span onClick = {props.user ? (e) => handleVote(e) : () => setRender(true)}>🌶️ {votes}</span>
            </div>
            {render && <Login hide = {() => setRender(false)}></Login>}
      </div>    
    );
}

export default Likes;
