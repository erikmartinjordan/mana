import React, { useState, useEffect }   from 'react';
import firebase , { auth }              from './Firebase.js';
import GetPoints                        from './GetPoints.js';
import insertNotificationAndReputation  from './InsertNotificationAndReputationIntoDatabase.js';
import Login                            from '../Components/Login';

const Likes = ({ authorId, postId }) => {  
    
    const [modal, setModal]       = useState(false);
    const [numVotes, setNumVotes] = useState(0);
    const [user, setUser]         = useState(null);
    const [votes, setVotes]       = useState({});
    const points                  = GetPoints(authorId);
    
    useEffect( () => {
        
        auth.onAuthStateChanged( user => { user ? setUser(user) : setUser(null) }); 
        
        firebase.database().ref(`posts/${postId}/voteUsers`).on('value', snapshot => { 

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
        
    },[]);
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} ) 
        
    });
    
    const handleVote = async (e) => {
        
        let userDidntVote = Object.keys(votes).indexOf(user.uid) === -1 ? true : false;
        
        if(userDidntVote){
            
            firebase.database().ref(`posts/${postId}/voteUsers/${user.uid}`).transaction(value => true);
            firebase.database().ref(`users/${authorId}/numSpicy`).transaction(value => ~~value + 1);
            
            let snapshot = await firebase.database().ref(`posts/${postId}/title`).once('value');
            let title    = snapshot.val().slice(0, 50) + '...';
            let url      = postId;
            
            insertNotificationAndReputation(authorId, 'chili', 'add', points, url, title);
            
        }
        else{
            
            firebase.database().ref(`posts/${postId}/voteUsers/${user.uid}`).remove();
            firebase.database().ref(`users/${authorId}/numSpicy`).transaction(value => ~~value - 1);
            
            let snapshot = await firebase.database().ref(`posts/${postId}/title`).once('value');
            let title    = snapshot.val().slice(0, 50) + '...';
            let url      = postId;
            
            insertNotificationAndReputation(authorId, 'chili', 'sub', points, url, title);
            
        }

    }
    
    const displayLoginModal = () => {
        
        setModal(true);
    }
    
    const hideLoginModal = () => {
        
        setModal(false);
        
    }
    
    return (
      <div className = 'Likes'>
            <div className = 'votes'>
                <span onClick = {user ? handleVote : displayLoginModal}>🌶️ {numVotes}</span>
            </div>
            {modal 
            ? <Login hide = {hideLoginModal}/>
            : null}
      </div>    
    );
}

export default Likes;
