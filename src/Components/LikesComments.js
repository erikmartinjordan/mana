import React, { useContext, useEffect, useState } from 'react'
import { TriangleUpIcon }                         from '@primer/octicons-react'
import Login                                      from './Login'
import Alert                                      from './Alert'
import Twemoji                                    from './Twemoji'
import { db, get, onValue, ref, runTransaction }  from '../Functions/Firebase'
import GetPoints                                  from '../Functions/GetPoints'
import insertNotificationAndReputation            from '../Functions/InsertNotificationAndReputationIntoDatabase'
import UserContext                                from '../Functions/UserContext'
import '../Styles/LikesComments.css'

const LikesComments = ({ authorId, postId, replyId }) => {  
    
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertTitle, setAlertTitle]     = useState(null)
    const [modal, setModal]               = useState(false)
    const [votes, setVotes]               = useState({})
    const points                          = GetPoints(authorId)
    const { user }                        = useContext(UserContext)
    
    useEffect(() => { 

        let votesRef = ref(db, `posts/${postId}/replies/${replyId}/voteUsers`)
        
        let unsubscribe = onValue(votesRef, snapshot => { 

            setVotes(snapshot.val() || {})
            
        })

        return () => unsubscribe()
        
    }, [postId, replyId])

    
    const handleVote = async (e) => {
        
        e.preventDefault() 
        
        if(user.uid === authorId){
            
            setAlertTitle('Ups...')
            setAlertMessage('No puedes votar tu propio comentario.')
            
        }
        else if(Number.isInteger(votes[user.uid]) && votes[user.uid] + (5 * 60 * 1000) > Date.now()){
            
            setAlertTitle('Ups...')
            setAlertMessage(`No puedes votar tan seguido, espera unos minutos...`)    
           
        }
        else{
            
            let [timeStamp, numApplauses, type] = votes[user.uid] ? [null, -1, 'sub'] : [Date.now(), 1, 'add']

            runTransaction(ref(db, `users/${authorId}/numApplauses`), value => ~~value + numApplauses)
            runTransaction(ref(db, `posts/${postId}/replies/${replyId}/voteUsers/${user.uid}`), _ => timeStamp)
            
            let message = (await get(ref(db, `posts/${postId}/replies/${replyId}/message`))).val().slice(0, 50) + '...'
            
            insertNotificationAndReputation(authorId, 'applause', type, points, postId, message, postId, replyId)
            
        }
        
    }
    
    const displayLoginModal = () => {
        
        setModal(true)
    }
    
    const hideLoginModal = () => {
        
        setModal(false)
        
    }
    
    return (
        <React.Fragment>
            <div className = 'Likes-Comments' onClick = {user ? handleVote : displayLoginModal}>
                <div className = {Object.keys(votes).some(voteId => voteId === user?.uid) ? `Votes Voted` : `Votes`}>
                    <span><TriangleUpIcon/> {Object.keys(votes).length}</span>
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
    )
}

export default LikesComments