import React, { useEffect, useState }   from 'react';
import firebase, { auth }               from './Firebase.js';
import GetPoints                        from './GetPoints.js';
import insertNotificationAndReputation  from './InsertNotificationAndReputationIntoDatabase.js';
import Login                            from '../Components/Login';

const LikesComments = (props) => {  
    
    const [authorId, setAuthorId] = useState(null);
    const [capture, setCapture]   = useState(null);
    const [forbid, setForbid]     = useState(false);
    const [render, setRender]     = useState(false);
    const [user, setUser]         = useState(null);
    const [votes, setVotes]       = useState(0);
    const points                  = GetPoints(authorId);
    
    useEffect( () => { 
        
        let mounted = true;
        
        auth.onAuthStateChanged( user => { user ? setUser(user) : setUser(null) }); 
        
        firebase.database().ref('posts/' + props.post + '/replies/'  + props.reply).on('value', snapshot => { 

            var capture = snapshot.val();            
            
            if(capture && mounted) {
                
                let uid   = capture.userUid;
                let votes = capture.voteUsers ? Object.keys(capture.voteUsers).length : 0;
                
                setCapture(capture);
                setAuthorId(uid);
                setVotes(votes);
            }
            
        });
        
        return () => {mounted = false};
        
    }, []);
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });
    
    const handleVote = async (e) => {
        
        let capture = await firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/voteUsers/').once('value');
        
        let usersIdsVotes = capture.val() ? Object.keys(capture.val()) : [];
        
        usersIdsVotes.indexOf(user.uid) === -1
        ? firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/voteUsers/' + user.uid).transaction( value => true)
        : firebase.database().ref('posts/' + props.post + '/replies/' + props.reply + '/voteUsers/' + user.uid).remove();
        
        usersIdsVotes.indexOf(user.uid) === -1
        ? insertNotificationAndReputation(authorId, 'applause', 'add', points)
        : insertNotificationAndReputation(authorId, 'applause', 'sub', points);
        
        usersIdsVotes.indexOf(user.uid) === -1
        ? firebase.database().ref(`users/${authorId}/numApplauses`).transaction(value => ~~value + 1)
        : firebase.database().ref(`users/${authorId}/numApplauses`).transaction(value => ~~value - 1);
        
    }

    return (
      <div className = 'likes-comments'>
            <div className = 'votes'>
                <span onClick = {user ? (e) => handleVote(e) : () => setRender(true)}>👏 {votes}</span>
            </div>
            {render && <Login hide = {() => setRender(false)}></Login>}
      </div>    
    );
}

export default LikesComments;
