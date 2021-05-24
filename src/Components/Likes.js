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
    const points                          = GetPoints(authorId);
    const { user }                        = useContext(UserContext);
    
    useEffect( () => {
        
        firebase.database().ref(`posts/${postId}/voteUsers`).on('value', snapshot => { 
            
            let votes = snapshot.val();            
            
            if(votes){
                
                setVotes(votes);
                
            }
            else{
                
                setVotes({});
                
            }
            
        });
        
    },[postId]);
    
    const handleVote = async (e) => {
        
        e.preventDefault(); 
        
        if(user.uid === authorId){
            
            setAlertTitle('Ups...');
            setAlertMessage('No puedes votar tu propia publicación.');
            
        }
        else if(Number.isInteger(votes[user.uid]) && votes[user.uid] + (5 * 60 * 1000) > Date.now()){
            
            setAlertTitle('Ups...');
            setAlertMessage(`No puedes votar tan seguido, espera unos minutos...`);    
           
        }
        else{
            
            let [timeStamp, numSpicy, type] = votes[user.uid] ? [null, -1, 'sub'] : [Date.now(), 1, 'add'];
            
            let ref_1 = firebase.database().ref(`users/${authorId}/numSpicy`);
            let ref_2 = firebase.database().ref(`posts/${postId}/voteUsers/${user.uid}`);
            
            ref_1.transaction(value => ~~value + numSpicy);
            ref_2.transaction(value => timeStamp);
            
            let title = (await firebase.database().ref(`posts/${postId}/title`).once('value')).val().slice(0, 50) + '...';
            
            insertNotificationAndReputation(authorId, 'spicy', type, points, postId, title, postId, null);
            
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