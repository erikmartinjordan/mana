import React, { useContext, useEffect, useState }   from 'react';
import Login                                        from './Login';
import Alert                                        from './Alert';
import Twemoji                                      from './Twemoji';
import firebase                                     from '../Functions/Firebase';
import GetPoints                                    from '../Functions/GetPoints';
import insertNotificationAndReputation              from '../Functions/InsertNotificationAndReputationIntoDatabase';
import UserContext                                  from '../Functions/UserContext';
import '../Styles/LikesComments.css';

const LikesComments = ({ authorId, postId, replyId }) => {  
    
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertTitle, setAlertTitle]     = useState(null);
    const [modal, setModal]               = useState(false);
    const [votes, setVotes]               = useState({});
    const points                          = GetPoints(authorId)[0];
    const { user }                        = useContext(UserContext);
    
    useEffect( () => { 

        let ref = firebase.database().ref(`posts/${postId}/replies/${replyId}/voteUsers`);
        
        let listener = ref.on('value', snapshot => { 
            
            var votes = snapshot.val();            
            
            if(votes){
                
                setVotes(votes);
                
            }
            else{
                
                setVotes({});
                
            }
            
        });

        return () => ref.off('value', listener);
        
    }, [postId, replyId]);

    
    const handleVote = async (e) => {
        
        e.preventDefault(); 
        
        if(user.uid === authorId){
            
            setAlertTitle('Ups...');
            setAlertMessage('No puedes votar tu propio comentario.');
            
        }
        else if(Number.isInteger(votes[user.uid]) && votes[user.uid] + (5 * 60 * 1000) > Date.now()){
            
            setAlertTitle('Ups...');
            setAlertMessage(`No puedes votar tan seguido, espera unos minutos...`);    
           
        }
        else{
            
            let [timeStamp, numApplauses, type] = votes[user.uid] ? [null, -1, 'sub'] : [Date.now(), 1, 'add'];
            
            let ref_1 = firebase.database().ref(`users/${authorId}/numApplauses`);
            let ref_2 = firebase.database().ref(`posts/${postId}/replies/${replyId}/voteUsers/${user.uid}`);
            
            ref_1.transaction(value => ~~value + numApplauses);
            ref_2.transaction(value => timeStamp);
            
            let message = (await firebase.database().ref(`posts/${postId}/replies/${replyId}/message`).once('value')).val().slice(0, 50) + '...';
            
            insertNotificationAndReputation(authorId, 'applause', type, points, postId, message, postId, replyId);
            
        }
        
    }
    
    const displayLoginModal = () => {
        
        setModal(true);
    }
    
    const hideLoginModal = () => {
        
        setModal(false);
        
    }
    
    return (
        <React.Fragment>
            <div className = 'Likes-Comments' onClick = {user ? handleVote : displayLoginModal}>
                <div className = {Object.keys(votes).some(voteId => voteId === user?.uid) ? `Votes Voted` : `Votes`}>
                    <span><Twemoji emoji = {'👏'}/> {Object.keys(votes).length}</span>
                </div>
                <Alert 
                    title      = {alertTitle} 
                    message    = {alertMessage} 
                    seconds    = {3} 
                    setMessage = {setAlertMessage} 
                    setTitle   = {setAlertTitle}
                />
            </div>
            {modal ? <Login hide  = {hideLoginModal}/> : null}
        </React.Fragment>    
    );
}

export default LikesComments;