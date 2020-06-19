import React, { useState, useEffect }   from 'react';
import TimeAgo                          from 'react-timeago';
import { Link }                         from 'react-router-dom';
import firebase, {auth}                 from '../Functions/Firebase';
import last30DaysOrOlder                from '../Functions/ReturnDifferenceBetweenTwoDates';
import ToggleButton                     from '../Functions/ToggleButton';
import buildFormatter                   from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                   from 'react-timeago/lib/language-strings/es';
import '../Styles/Notifications.css';

const formatter = buildFormatter(spanishStrings);

const Notifications = ({hide, user}) => {  
    
    const [displayNotifications, setDisplayNotifications]   = useState(true);
    const [keys, setKeys]                                   = useState([]);
    const [notifications, setNotifications]                 = useState('loading');
    const [points, setPoints]                               = useState(0);
    const [show, setShow]                                   = useState(false);
    
    useEffect( () => {
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );  
    });

    useEffect( () => {
      
        firebase.database().ref(`notifications/${user.uid}`).on('value', snapshot => { 
            
            if(snapshot.val()) 
                setNotifications(snapshot.val())
            else               
                setNotifications('empty');
            
        }); 
        
        firebase.database().ref(`users/${user.uid}/displayNotifications`).on('value', snapshot => { 
            
            if(snapshot.exists())    
                setDisplayNotifications(snapshot.val());
            
        });  
      
    }, []);
    
    return (
        <div className = 'Notifications'>
            <div className = 'Notifications-Wrap'>
                <div className = 'Notifications-Menu'>
                    <ToggleNotifications 
                        user = {user} 
                        displayNotifications = {displayNotifications} 
                        setDisplayNotifications = {setDisplayNotifications}
                    />
                    { notifications === 'loading'
                    ? <LoadingNotifications/>
                    : notifications === 'empty'
                    ? <EmptyNotifications/>
                    : displayNotifications === true
                    ? <ListNotifications notifications = {notifications} user = {user} hide = {hide}/>
                    : <NoDisplayNotifications/>
                    }
                </div>
            </div>
            <div onClick = {hide} className = 'Invisible'></div>
        </div>
    );
}

export default Notifications;

const ToggleNotifications = ({displayNotifications, setDisplayNotifications, user}) => {

    const handleNotifications = () => {
        
        firebase.database().ref(`users/${user.uid}/displayNotifications`).transaction(value => !displayNotifications);
        
        setDisplayNotifications(!displayNotifications);
    }
    
    return(
        <div className = 'DisplayNotifications' onClick = {() => handleNotifications()}>
            Notificaciones <ToggleButton status = {displayNotifications ? 'on' : 'off'}/>
        </div>
    );
}

const ListNotifications = ({notifications, user, hide}) => {
    
    const [notificationsList, setNotificationsList] = useState([]);
    
    useEffect( () => {
        
        Object.keys(notifications).map(key => {
            
            firebase.database().ref(`notifications/${user.uid}/${key}/read`).transaction(value => true); 
            
        });
        
    }, []);
    
    useEffect( () => {
       
        let sortedNotificationsArray = Object.values(notifications).sort( (a,b) => a.timeStamp > b.timeStamp ? -1 : 1);
        
        setNotificationsList(sortedNotificationsArray);
        
    }, []);
    
    const notificationTitle = (index) => {
        
        let thisTitle = last30DaysOrOlder(Date.now(), notificationsList[index].timeStamp);
        let prevTitle = index > 0 ? last30DaysOrOlder(Date.now(), notificationsList[index - 1].timeStamp) : null;
        
        return thisTitle !== prevTitle ? thisTitle : null;
        
    }
    
    return (
        <React.Fragment>
            {notificationsList.map( ({points, message, read, date, url}, index) => 
                <div key = {index} className = 'Notification'>
                    {notificationTitle(index) 
                    ? <div className = 'Notifications-Ago'>{notificationTitle(index)}</div> 
                    : null
                    }
                    <div className = 'Notifications-Content'>
                        <span className = 'Notifications-Photo'>
                            <img src = {user.photoURL}></img>
                        </span>
                        <span className = 'Notifications-Points'>
                            {points > 0 
                            ? <span className = 'Pos'>+{points}</span>
                            : <span className = 'Neg'> {points}</span>
                            }
                        </span>
                        <span className = 'Notifications-Message'>
                            {url ? <Link onClick = {hide} to = {`/comunidad/post/${url}`}>{message}</Link> : message}
                            <TimeAgo formatter = {formatter} date = {date}/>
                        </span>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
    
}

const LoadingNotifications = () => {
    
    return(
        <div className = 'Notifications-Content-Empty'>
            <div className = 'Big-Emoji'>😼</div>
            <div className = 'Empty-Message'>Cargando notificaciones...</div>
        </div>
    );
    
}

const EmptyNotifications = () => {
    
    return (
        <div className = 'Notifications-Content-Empty'>
            <div className = 'Big-Emoji'>😼</div>
            <div className = 'Empty-Message'>¡Miaaaaau! Aún no tienes notificaciones.</div>
        </div>
    );
    
}

const NoDisplayNotifications = () => {
    
    return (
        <div className = 'Notifications-Content-Empty'>
            <div className = 'Big-Emoji'>😼</div>
            <div className = 'Empty-Message'>¡Miaaaaau! Las notificaciones están desactivadas.</div>
        </div>
    );
    
}