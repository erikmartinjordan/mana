import React, { useEffect, useState }   from 'react';
import firebase                         from './Firebase.js';
import nmsNotification                  from './InsertNotificationIntoDatabase.js';
import Login                            from '../Components/Login';

const LikesComments = (props) => {  
    
    const [capture, setCapture] = useState(null);
    const [forbid, setForbid] = useState(false);
    const [render, setRender] = useState(false);
    const [userid, setUserid] = useState(null);
    const [votes, setVotes] = useState(0);
    
    useEffect( () => { 
        
        // Component is mounted
        let mounted = true;
        
        firebase.database().ref('posts/' + props.post + '/replies/'  + props.reply).on('value', snapshot => { 

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
        
    }, []);
    
    useEffect( () => {
            
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });
    
    const handleVote = async (e) => {
        
        // Capturing likes object
        let capture = await firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/voteUsers/').once('value');
        
        // Getting the fingerprint of the users
        let users = capture.val() ? Object.keys(capture.val()) : [];
        console.log(users);
        
        // If user liked the post already, remove the branch
        // In other case, add it
        users.indexOf(userid) === -1
        ? firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/voteUsers/' + props.user.uid).transaction( value => true)
        : firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/voteUsers/' + props.user.uid).remove();
        
        // Sending notification to user
        users.indexOf(userid) === -1
        ? nmsNotification(userid, 'applause', 'add')
        : nmsNotification(userid, 'applause', 'sub');
        
    }

    return (
      <div className = 'likes-comments'>
            <div className = 'votes'>
                <span onClick = {props.user ? (e) => handleVote(e) : () => setRender(true)}>👏 {votes}</span>
            </div>
            {render && <Login hide = {() => setRender(false)}></Login>}
      </div>    
    );
}

export default LikesComments;
