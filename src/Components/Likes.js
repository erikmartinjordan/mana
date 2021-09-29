import React, { useContext, useState, useEffect }   from 'react'
import Login                                        from './Login'
import Alert                                        from './Alert'
import Twemoji                                      from './Twemoji'
import { db, get, onValue, ref, runTransaction }    from '../Functions/Firebase'
import GetPoints                                    from '../Functions/GetPoints'
import insertNotificationAndReputation              from '../Functions/InsertNotificationAndReputationIntoDatabase'
import UserContext                                  from '../Functions/UserContext'
import '../Styles/LikesComments.css'

const Likes = ({ authorId, postId }) => {  
    
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertTitle, setAlertTitle]     = useState(null)
    const [modal, setModal]               = useState(false)
    const [votes, setVotes]               = useState({})
    const points                          = GetPoints(authorId)
    const { user }                        = useContext(UserContext)
    
    useEffect(() => {

        let votesRef = ref(db,`posts/${postId}/voteUsers`)

        let unsubscribe = onValue(votesRef, snapshot => {

            setVotes(snapshot.val() || {})

        })

        return () => unsubscribe()
        
    },[postId])
    
    const handleVote = async (e) => {
        
        e.preventDefault() 
        
        if(user.uid === authorId){
            
            setAlertTitle('Ups...')
            setAlertMessage('No puedes votar tu propia publicación.')
            
        }
        else if(Number.isInteger(votes[user.uid]) && votes[user.uid] + (5 * 60 * 1000) > Date.now()){
            
            setAlertTitle('Ups...')
            setAlertMessage(`No puedes votar tan seguido, espera unos minutos...`)    
           
        }
        else{
            
            let [timeStamp, numSpicy, type] = votes[user.uid] ? [null, -1, 'sub'] : [Date.now(), 1, 'add']
            

            runTransaction(ref(db, `users/${authorId}/numSpicy`), value => ~~value + numSpicy)
            runTransaction(ref(db, `posts/${postId}/voteUsers/${user.uid}`), _ => timeStamp)
            
            let title = (await get(ref(db, `posts/${postId}/title`))).val().slice(0, 50) + '...'
            
            insertNotificationAndReputation(authorId, 'spicy', type, points, postId, title, postId, null)
            
        }
        
    }
    
    const displayLoginModal = (e) => {
        
        e.preventDefault()
        
        setModal(true)
        
    }
    
    const hideLoginModal = (e) => {
        
        e.preventDefault()
        
        setModal(false)
        
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
    )
}

export default Likes