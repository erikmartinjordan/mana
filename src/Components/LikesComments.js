import React, { useEffect, useState }   from 'react';
import Login                            from './Login';
import Alert                            from './Alert';
import firebase, { auth }               from '../Functions/Firebase';
import GetPoints                        from '../Functions/GetPoints';
import insertNotificationAndReputation  from '../Functions/InsertNotificationAndReputationIntoDatabase';
import '../Styles/LikesComments.css';

const LikesComments = ({ authorId, postId, replyId }) => {  
    
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertTitle, setAlertTitle]     = useState(null);
    const [modal, setModal]               = useState(false);
    const [numVotes, setNumVotes]         = useState(0);
    const [user, setUser]                 = useState(null);
    const [votes, setVotes]               = useState({});
    const points                          = GetPoints(authorId);
    
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
        
        let autoVote = user.uid === authorId ? true : false;

        if(autoVote){
            
            setAlertTitle('Ups...');
            setAlertMessage('No puedes votar tu propio comentario.');
            
        }
        else{
            
            let userDidntVote = Object.keys(votes).indexOf(user.uid) === -1 ? true : false;
            
            if(userDidntVote){
                
                firebase.database().ref(`posts/${postId}/replies/${replyId}/voteUsers/${user.uid}`).transaction(value => true);
                firebase.database().ref(`users/${authorId}/numApplauses`).transaction(value => ~~value + 1);
                
                let snapshot = await firebase.database().ref(`posts/${postId}/replies/${replyId}/message`).once('value');
                let message  = snapshot.val().slice(0, 50) + '...';
                let url      = postId;
                
                insertNotificationAndReputation(authorId, 'applause', 'add', points, url, message, postId, replyId);
                
            }
            else{
                
                firebase.database().ref(`posts/${postId}/replies/${replyId}/voteUsers/${user.uid}`).remove();
                firebase.database().ref(`users/${authorId}/numApplauses`).transaction(value => ~~value - 1);
                
                let snapshot = await firebase.database().ref(`posts/${postId}/replies/${replyId}/message`).once('value');
                let message  = snapshot.val().slice(0, 50) + '...';
                let url      = postId;
                
                insertNotificationAndReputation(authorId, 'applause', 'sub', points, url, message, postId, replyId);
                
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
      <div className = 'Likes-Comments' onClick = {user ? handleVote : displayLoginModal}>
            <div className = 'Votes'>
                <span>👏 {numVotes}</span>
            </div>
            {modal ? <Login hide  = {hideLoginModal}/> : null}
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

export default LikesComments;
