import React, { useState, useEffect } from 'react';
import firebase from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns if there are unread notifications 
//
//
//--------------------------------------------------------------/
const GetUnreadNotifications = ({user}) => {
    
    const [displayNotifications, setDisplayNotifications]   = useState(true);
    const [unread, setUnread]                               = useState([]);
        
    useEffect( () => {
      
        firebase.database().ref(`notifications/${user.uid}`).on('value', snapshot => { 
            
            if(snapshot){
                
                let notifications       = snapshot.val();
                let entries             = Object.entries(notifications);
                let unreadNotifications = entries.filter( ([key, notification]) => !notification.read);
                
                setUnread(unreadNotifications);
                
            }
            
        });
        
        firebase.database().ref(`users/${user.uid}/displayNotifications`).on('value', snapshot => { 
            
            if(snapshot) 
                setDisplayNotifications(snapshot.val())
            else               
                setDisplayNotifications(true);
            
        }); 
        
      
    }, []);
    
    useEffect( () => {
        
        if(displayNotifications){
            
            unread.map(([key, value]) => { 
                
                firebase.database().ref(`notifications/${user.uid}/${key}/read`).transaction(value => true);
                
            });
            
        }
        
    }, [displayNotifications]);
    
    return displayNotifications && unread.length > 0 ? <span className = 'Notifications-Number'></span> : null;
    
}

export default GetUnreadNotifications;