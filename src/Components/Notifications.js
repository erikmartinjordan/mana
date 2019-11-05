import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import '../Styles/Notifications.css';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import TimeAgo from 'react-timeago';
import printDate from '../Functions/ReturnDifferenceBetweenTwoDates.js';

const formatter = buildFormatter(spanishStrings);

const Notifications = (props) => {  
    
    const [keys, setKeys] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [points, setPoints] = useState(0);
    const [show, setShow] = useState(false);

    useEffect( () => {
        
        // Check if component is mounted
        let mounted = true;
      
        // Getting the notifications 
        firebase.database().ref('notifications/' + props.user.uid).on('value', snapshot => { 
            
            // Capturing data
            var notifications = snapshot.val();
            var keys = notifications ? Object.keys(notifications) : [];
            var array = [];

            // Array of points and setting the state
            if(notifications && mounted){ 
                notifications = keys.map( id => {
                    return [notifications[id].points, notifications[id].message, notifications[id].read, notifications[id].timeStamp] 
                });
                
                setKeys(keys);
                setNotifications(notifications);
                
                keys.map( key => {
                  firebase.database().ref('notifications/' + props.user.uid + `/${key}/read/`).transaction( read => read = true )
                });
            }
            
        });
        
        // Unmounting component
        return () => { mounted = false };
      
      
    }, []);
    
    useEffect( () => {
        // Setting emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );  
    });

    const printNotifications = () => {
        
      var points;
      var res;
      var message;
      var reverse;
        
      // Reversing notification's array
      reverse = [...notifications].reverse();
        
      // Drawing block when there are notifications
      res = reverse.map( (notification, key) =>
                <div key = {key} className = 'Notification'>
                        { printDate(Date.now(), notification[3]) !== message 
                        && <div  className = 'Notifications-Ago'> {message = printDate(Date.now(), notification[3])} </div>
                        }
                    <div className = 'Notifications-Content'>
                        <span className = 'Notifications-Photo'>
                            <img src = {props.user.photoURL}></img>
                        </span>
                        <span className = 'Notifications-Points'>
                            { notification[0] > 0 
                            ? <span className = 'Pos'>+{notification[0]}</span>
                            : <span className = 'Neg'> {notification[0]}</span>
                            }
                        </span>
                        <span className = 'Notifications-Message'>
                            { notification[1] }
                            <TimeAgo formatter = {formatter} date = {notification[3]}/>
                        </span>
                    </div>
                </div>
      );
        
      // If 0 notifications, we write it
      if(notifications.length === 0){
          
          res = <div className = 'Notifications-Content-Empty'>
                    <div className = 'Big-Emoji'>😼</div>
                    <div className = 'Empty-Message'>¡Miaaaaau! Aún no tienes notificaciones.</div>
                </div>
      }
        
      return res;
        
    }

    
    return (
        <div className = 'Notifications'>
            <div className = 'Notifications-Wrap'>
                <div className = 'Notifications-Menu'>{printNotifications()}</div>
            </div>
            <div onClick = {props.hide} className = 'Invisible'></div>
        </div>
    );
}

export default Notifications;