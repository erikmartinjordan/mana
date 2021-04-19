import React, { useContext, useState, useEffect }   from 'react';
import Login                                        from './Login';
import Alert                                        from './Alert';
import Twemoji                                      from './Twemoji';
import firebase                                     from '../Functions/Firebase';
import GetPoints                                    from '../Functions/GetPoints';
import insertNotificationAndReputation              from '../Functions/InsertNotificationAndReputationIntoDatabase';
import UserContext                                  from '../Functions/UserContext';
import '../Styles/LikesComments.css';

const Likes = ({ authorId, postId }) => {  
    
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertTitle, setAlertTitle]     = useState(null);
    const [modal, setModal]               = useState(false);
    const [votes, setVotes]               = useState({});
    const points                          = GetPoints(authorId)[0];
    const { user }                        = useContext(UserContext);
    
    useEffect( () => {
        
        firebase.database().ref(`posts/${postId}/voteUsers`).on('value', snapshot => { 
            
            var votes = snapshot.val();            
            
            if(votes){
                
                setVotes(votes);
                
            }
            else{
                
                setVotes({});
            }
            
        });
        
    },[postId]);
    
    const autoVote = () => {
        
        return user.uid === authorId ? true : false;
        
    }
    
    const persistentVote = async (mins) => {
        
        let snapshot  = await firebase.database().ref(`posts/${postId}/voteUsers/${user.uid}`).once('value');
        let timeStamp = snapshot.val() || Date.now();
        let current   = Date.now();
        
        return (timeStamp + (mins * 60) < current) ? true : false;
        
    }
    
    const vote = (title, url, timeStamp) => {
        
        let userDidntVote = Object.keys(votes).indexOf(user.uid) === -1 ? true : false;
        
        let [vote, numSpicy, type] = userDidntVote ? [timeStamp, 1, 'add'] : [null, -1, 'sub'];
     
        firebase.database().ref(`posts/${postId}/voteUsers/${user.uid}`).transaction(value => vote);
        firebase.database().ref(`users/${authorId}/numSpicy`).transaction(value => ~~value + numSpicy);
        
        insertNotificationAndReputation(authorId, 'spicy', type, points, url, title, postId, null);    
        
    }
    
    const handleVote = async (e) => {
        
        e.preventDefault();
        
        let snapshot = await firebase.database().ref(`posts/${postId}/title`).once('value');
        let title    = snapshot.val().slice(0, 50) + '...';
        let url      = postId;
        
        if(autoVote()){
            
            setAlertTitle('Ups...');
            setAlertMessage('No puedes votar tu propio comentario.');
            
        }
        else if(await persistentVote(5)){
            
            setAlertTitle('Ups...');
            setAlertMessage(`Debes esperar 5 minutos para poder votar de nuevo.`);
            
        }
        else{
            
            vote(title, url, Date.now());
            
        }
        
    }
    
    const displayLoginModal = (e) => {
        
        e.preventDefault();
        
        setModal(true);
        
    }
    
    const hideLoginModal = (e) => {
        
        e.preventDefault();
        
        setModal(false);
        
    }
    
    return (
        <React.Fragment>
            <div className = 'Likes' onClick = {user ? handleVote : displayLoginModal}>
                <div className = {Object.keys(votes).some(voteId => voteId === user?.uid) ? `Votes Voted` : `Votes`}>
                    <span><Twemoji emoji = {'🌶️'}/> {Object.keys(votes).length}</span>
                </div>
                <Alert 
                    title      = {alertTitle} 
                    message    = {alertMessage} 
                    seconds    = {3} 
                    setMessage = {setAlertMessage} 
                    setTitle   = {setAlertTitle}
                />
            </div> 
            {modal ? <Login hide = {hideLoginModal}/> : null}
        </React.Fragment>   
    );
}

export default Likes;
