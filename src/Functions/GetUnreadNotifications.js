import React, { useState, useEffect } from 'react';
import firebase from './Firebase.js';

//--------------------------------------------------------------/
//
//
// This functions returns if there are unread articles 
//
//
//--------------------------------------------------------------/
const GetUnreadNotifications = (props) => {
    
    const [unread, setUnread] = useState(false);
    
    useEffect( () => {
      
        // Getting the notifications 
        firebase.database().ref('notifications/' + props.user.uid).on('value', snapshot => { 
            
            // Capturing data
            var notifications = snapshot.val();
            var keys = notifications ? Object.keys(notifications) : [];
            
            // We consider there aren't unread notifications
            let unread = false;
            
            // Array of points and setting the state
            if(notifications){
                
                for(let i = 0; i < keys.length; i ++){
                    
                    if(!notifications[keys[i]].read) {
                        
                        unread = true;
                        break;
                    }
                }
            }
            
            setUnread(unread);
            
        });
      
    }, []);
        
    return unread ? <span className = 'Notifications-Number'></span> : null;
    
}

export default GetUnreadNotifications;