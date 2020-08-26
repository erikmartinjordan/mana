import React, { useState, useEffect }   from 'react';
import Login                            from './Login';
import Alert                            from './Alert';
import firebase , { auth }              from '../Functions/Firebase';
import GetPoints                        from '../Functions/GetPoints';
import insertNotificationAndReputation  from '../Functions/InsertNotificationAndReputationIntoDatabase';
import '../Styles/LikesComments.css';

const Likes = ({ authorId, postId }) => {  
    
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertTitle, setAlertTitle]     = useState(null);
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
        
        let autoVote = user.uid === authorId ? true : false;
        
        if(autoVote){
            
            setAlertTitle('Ups...');
            setAlertMessage('No puedes votar tu propio comentario.');
            
        }
        else{
            
            let userDidntVote = Object.keys(votes).indexOf(user.uid) === -1 ? true : false;
            
            if(userDidntVote){
                
                firebase.database().ref(`posts/${postId}/voteUsers/${user.uid}`).transaction(value => true);
                firebase.database().ref(`users/${authorId}/numSpicy`).transaction(value => ~~value + 1);
                
                let snapshot = await firebase.database().ref(`posts/${postId}/title`).once('value');
                let title    = snapshot.val().slice(0, 50) + '...';
                let url      = postId;
                
                insertNotificationAndReputation(authorId, 'chili', 'add', points, url, title, postId, null);
                
            }
            else{
                
                firebase.database().ref(`posts/${postId}/voteUsers/${user.uid}`).remove();
                firebase.database().ref(`users/${authorId}/numSpicy`).transaction(value => ~~value - 1);
                
                let snapshot = await firebase.database().ref(`posts/${postId}/title`).once('value');
                let title    = snapshot.val().slice(0, 50) + '...';
                let url      = postId;
                
                insertNotificationAndReputation(authorId, 'chili', 'sub', points, url, title, postId, null);
                
            }
            
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
            <div className = 'Votes'>
                <span onClick = {user ? handleVote : displayLoginModal}>🌶️ {numVotes}</span>
            </div>
            {modal ? <Login hide = {hideLoginModal}/> : null}
            <Alert 
                title      = {alertTitle} 
                message    = {alertMessage} 
                seconds    = {3} 
                setMessage = {setAlertMessage} 
                setTitle   = {setAlertTitle}
            />
      </div>    
    );
}

export default Likes;
