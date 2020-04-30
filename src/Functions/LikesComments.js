import React, { useEffect, useState }   from 'react';
import firebase, { auth }               from './Firebase.js';
import GetPoints                        from './GetPoints.js';
import insertNotificationAndReputation  from './InsertNotificationAndReputationIntoDatabase.js';
import Login                            from '../Components/Login';

const LikesComments = ({ authorId, postId, replyId }) => {  
    
    const [modal, setModal]       = useState(false);
    const [numVotes, setNumVotes] = useState(0);
    const [user, setUser]         = useState(null);
    const [votes, setVotes]       = useState({});
    const points                  = GetPoints(authorId);
    
    useEffect( () => { 
        
        auth.onAuthStateChanged( user => { user ? setUser(user) : setUser(null) }); 
        
        firebase.database().ref(`posts/${postId}/replies/${replyId}/voteUsers`).on('value', snapshot => { 
            
            var votes = snapshot.val();            
            
            if(votes){
                
                setVotes(votes);
                setNumVotes(Object.keys(votes).length);
                
            }
            else{
                
                setVotes({});
                setNumVotes(0);
            }
            
        });
        
    }, []);
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });
    
    const handleVote = async (e) => {
        
        let userDidntVote = Object.keys(votes).indexOf(user.uid) === -1 ? true : false;
        
        if(userDidntVote){
            
            firebase.database().ref(`posts/${postId}/replies/${replyId}/voteUsers/${user.uid}`).transaction(value => true);
            firebase.database().ref(`users/${authorId}/numApplauses`).transaction(value => ~~value + 1)
            insertNotificationAndReputation(authorId, 'applause', 'add', points);
            
        }
        else{
            
            firebase.database().ref(`posts/${postId}/replies/${replyId}/voteUsers/${user.uid}`).remove();
            firebase.database().ref(`users/${authorId}/numApplauses`).transaction(value => ~~value - 1);
            insertNotificationAndReputation(authorId, 'applause', 'sub', points);
            
        }
        
    }
    
    
    const displayLoginModal = () => {
        
        setModal(true);
    }
    
    const hideLoginModal = () => {
        
        setModal(false);
        
    }
    
    return (
      <div className = 'likes-comments'>
            <div className = 'votes'>
                <span onClick = {user ? handleVote : displayLoginModal}>👏 {numVotes}</span>
            </div>
            {modal
            ? <Login hide = {hideLoginModal}/>
            : null}
      </div>    
    );
}

export default LikesComments;
