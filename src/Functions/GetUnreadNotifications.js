import React, { useState, useEffect } from 'react';
import firebase from './Firebase.js';

const GetUnreadNotifications = ({user}) => {
    
    const [displayNotifications, setDisplayNotifications]   = useState(true);
    const [newPoints, setNewPoints]                         = useState(null);
    const [unread, setUnread]                               = useState([]);
        
    useEffect( () => {
      
        firebase.database().ref(`notifications/${user.uid}`).on('value', snapshot => { 
            
            if(snapshot.val()){
                
                let notifications       = snapshot.val();
                let entries             = Object.entries(notifications);
                let unreadNotifications = entries.filter( ([key, notification]) => !notification.read);
                let newPoints           = unreadNotifications.reduce( (acc, value) => value[1].points + acc, 0);
                
                setNewPoints(newPoints);
                setUnread(unreadNotifications);
                
            }
            
        });
        
        firebase.database().ref(`users/${user.uid}/displayNotifications`).on('value', snapshot => { 
            
            if(snapshot.exists())    
                setDisplayNotifications(snapshot.val());
            
        }); 
        
      
    }, []);
    
    useEffect( () => {
        
        if(displayNotifications){
            
            unread.map(([key, value]) => { 
                
                firebase.database().ref(`notifications/${user.uid}/${key}/read`).transaction(value => true);
                
            });
            
        }
        
    }, [displayNotifications]);
    
    return displayNotifications && unread.length > 0 ? <NotificationsPoints points = {newPoints}/> : null;
    
}

export default GetUnreadNotifications;

const NotificationsPoints = ({points}) => {
    
    if(points > 0)   return <span className = 'Notifications-Number' style = {{background: 'var(--greenMint)'}}>{`+${points}`}</span>;
    if(points < 0)   return <span className = 'Notifications-Number' style = {{background: 'var(--red)'}}>{`${points}`}</span>;
    if(points === 0) return null;
    
}