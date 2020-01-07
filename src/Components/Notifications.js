import React, { useState, useEffect }   from 'react';
import TimeAgo                          from 'react-timeago';
import firebase, {auth}                 from '../Functions/Firebase.js';
import last30DaysOrOlder                from '../Functions/ReturnDifferenceBetweenTwoDates.js';
import buildFormatter                   from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                   from 'react-timeago/lib/language-strings/es';
import '../Styles/Notifications.css';

const formatter = buildFormatter(spanishStrings);

const Notifications = (props) => {  
    
    const [keys, setKeys] = useState([]);
    const [notifications, setNotifications] = useState('loading');
    const [points, setPoints] = useState(0);
    const [show, setShow] = useState(false);
    
    useEffect( () => {
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );  
    });

    useEffect( () => {
        
        let mounted = true;
      
        firebase.database().ref('notifications/' + props.user.uid).on('value', snapshot => { 
            
            var notifications = snapshot.val();
            var keys = notifications ? Object.keys(notifications) : [];
            var array = [];

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
        
        return () => { mounted = false };
      
      
    }, []);

    const printNotifications = () => {
        
        let reverse = [...notifications].reverse();

        let res = reverse.map( (notification, index) => {
            
                let printDate = true;
                let thisNotificationTitle = last30DaysOrOlder(Date.now(), [notification[3]]);
                
                if(index > 0){
                    
                    let prevNotificationTitle = last30DaysOrOlder(Date.now(), reverse[index - 1][[3]]);
                    let thisNotificationTitle = last30DaysOrOlder(Date.now(), reverse[index][[3]]);
                    
                    printDate = prevNotificationTitle !== thisNotificationTitle;
                    
                }

                return <div key = {index} className = 'Notification'>
                            { printDate
                            ? <div  className = 'Notifications-Ago'>{thisNotificationTitle}</div>
                            : null
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
        });
        
        if(notifications === 'loading'){
            
            res = <div className = 'Notifications-Content-Empty'>
                    <div className = 'Big-Emoji'>😼</div>
                    <div className = 'Empty-Message'>Cargando notificaciones...</div>
                </div>;
        }
           
        if(notifications !== 'loading' && notifications.length === 0){
            
            res = <div className = 'Notifications-Content-Empty'>
                    <div className = 'Big-Emoji'>😼</div>
                    <div className = 'Empty-Message'>¡Miaaaaau! Aún no tienes notificaciones.</div>
                </div>;
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