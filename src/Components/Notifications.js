import React, { useState, useEffect }                           from 'react'
import moment                                                   from 'moment'
import { Link }                                                 from 'react-router-dom'
import ToggleButton                                             from './ToggleButton'
import Twemoji                                                  from './Twemoji'
import { db, limitToLast, onValue, query, ref, runTransaction } from '../Functions/Firebase'
import '../Styles/Notifications.css'

const Notifications = ({hide, user}) => {  
    
    const [displayNotifications, setDisplayNotifications] = useState(true)
    const [maxNotifications, setMaxNotifications]         = useState(20)
    const [notifications, setNotifications]               = useState('loading')
    
    useEffect(() => {
        
        if(user.uid){

            var unsubscribe_1 = onValue(query(ref(db, `notifications/${user.uid}`), limitToLast(maxNotifications)), snapshot => {

                setNotifications(snapshot.val() || 'empty')

            })

            var unsubscribe_2 = onValue(ref(db, `users/${user.uid}/displayNotifications`), snapshot => {

                setDisplayNotifications(snapshot.val() || true)

            })
            
        }

        return () => {

            unsubscribe_1()
            unsubscribe_2()

        }
      
    }, [user, maxNotifications])
    
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
                    ? <ListNotifications 
                        notifications = {notifications} 
                        user = {user} 
                        hide = {hide} 
                        maxNotifications = {maxNotifications}
                        setMaxNotifications = {setMaxNotifications}
                    />
                    : <NoDisplayNotifications/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Notifications

const ToggleNotifications = ({displayNotifications, setDisplayNotifications, user}) => {

    const handleNotifications = () => {

        runTransaction(ref(db, `users/${user.uid}/displayNotifications`), _ => !displayNotifications)
        
        setDisplayNotifications(!displayNotifications)
    }
    
    return(
        <div className = 'DisplayNotifications' onClick = {handleNotifications}>
            Notificaciones <ToggleButton status = {displayNotifications ? 'on' : 'off'}/>
        </div>
    )
}

const ListNotifications = ({notifications, user, hide, maxNotifications, setMaxNotifications}) => {
    
    const [notificationsList, setNotificationsList] = useState([])
    
    useEffect( () => {
        
        Object.keys(notifications).forEach(key => {

            runTransaction(ref(db, `notifications/${user.uid}/${key}/read`), _ => true)
            
        })
        
    }, [user, notifications])
    
    useEffect( () => {
       
        let sortedNotificationsArray = Object.values(notifications).sort((a,b) => a.timeStamp > b.timeStamp ? -1 : 1)
        
        setNotificationsList(sortedNotificationsArray)
        
    }, [notifications])
    
    const notificationTitle = (index) => {
        
        let now = moment()
        
        let currentTitle  = now.diff(moment(notificationsList[index    ]?.timeStamp), 'days') > 30 ? 'Más antiguo' : 'Últimos 30 días'
        let previousTitle = now.diff(moment(notificationsList[index - 1]?.timeStamp), 'days') > 30 ? 'Más antiguo' : 'Últimos 30 días'
     
        if(index === 0) 
            return currentTitle
         
        else if(currentTitle !== previousTitle)
            return currentTitle
            
        else
            return null
        
    }
    
    return (
        <React.Fragment>
            {notificationsList.map( ({points, message, read, date, url, replyId}, index) => 
                <div key = {index} className = 'Notification'>
                    {notificationTitle(index) 
                    ? <div className = 'Notifications-Ago'>{notificationTitle(index)}</div> 
                    : null
                    }
                    <div className = 'Notifications-Content'>
                        <span className = 'Notifications-Photo'>
                            <img src = {user.photoURL} alt = {'Foto de perfil'}></img>
                        </span>
                        <span className = 'Notifications-Points'>
                            {points > 0 
                            ? <span className = 'Pos'>+{points}</span>
                            : <span className = 'Neg'> {points}</span>
                            }
                        </span>
                        <span className = 'Notifications-Message'>
                            {url ? <Link onClick = {hide} to = {`/p/${url}/#${replyId}`}>{message}</Link> : message}
                        </span>
                    </div>
                </div>
            )}
            <div className = 'DisplayMore'>
                { maxNotifications !== Infinity 
                  ? <span onClick = {() => setMaxNotifications(Infinity)}>Mostrar todas las notificaciones</span>
                  : null
                }
            </div>
        </React.Fragment>
    )
    
}

const LoadingNotifications = () => {
    
    return(
        <div className = 'Notifications-Content-Empty'>
            <div className = 'Big-Emoji'><Twemoji emoji = {'😼'}/></div>
            <div className = 'Empty-Message'>Cargando notificaciones...</div>
        </div>
    )
    
}

const EmptyNotifications = () => {
    
    return (
        <div className = 'Notifications-Content-Empty'>
            <div className = 'Big-Emoji'><Twemoji emoji = {'😼'}/></div>
            <div className = 'Empty-Message'>¡Miaaaaau! Aún no tienes notificaciones.</div>
        </div>
    )
    
}

const NoDisplayNotifications = () => {
    
    return (
        <div className = 'Notifications-Content-Empty'>
            <div className = 'Big-Emoji'><Twemoji emoji = {'😼'}/></div>
            <div className = 'Empty-Message'>¡Miaaaaau! Las notificaciones están desactivadas.</div>
        </div>
    )
    
}