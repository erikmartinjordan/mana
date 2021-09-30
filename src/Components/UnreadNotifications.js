import React, { useState, useEffect } from 'react'
import { db, onValue, ref }           from '../Functions/Firebase'
import '../Styles/UnreadNotifications.css'

const UnreadNotifications = ({user}) => {
    
    const [displayNotifications, setDisplayNotifications] = useState(true)
    const [newPoints, setNewPoints]                       = useState(null)
    const [unread, setUnread]                             = useState([1])
    
    useEffect( () => {
        
        if(user){
            
            var unsubscribe = onValue(ref(db, `notifications/${user.uid}`), snapshot => { 
                
                if(snapshot.val()){
                    
                    let notifications       = snapshot.val()
                    let entries             = Object.entries(notifications)
                    let unreadNotifications = entries.filter( ([key, notification]) => !notification.read)
                    let newPoints           = unreadNotifications.reduce( (acc, value) => value[1].points + acc, 0)
                    
                    setNewPoints(newPoints)
                    setUnread(unreadNotifications)
                    
                }
                
            })
            
        }
        
        return () => unsubscribe()
        
    }, [user])
    
    useEffect(() => {
        
        if(user){
            
            
            var unsubscribe = onValue(ref(db, `users/${user.uid}/displayNotifications`), snapshot => { 
                
                setDisplayNotifications(snapshot.val() || true)
                
            }) 
            
        }
        
        return () => unsubscribe()
        
    }, [user])
    
    return (
        <React.Fragment>
            { newPoints > 0
            ? <NotificationsPoints points = {newPoints}/>
            : null
            }
        </React.Fragment>
    )
    
}

export default UnreadNotifications

const NotificationsPoints = ({points}) => {
    
    return(
        <React.Fragment>
            <span className = 'NotificationPoints'>
                <span className = 'Green'>{points > 0 ? `+${points}` : points}</span>
            </span>
        </React.Fragment>
    )
    
}