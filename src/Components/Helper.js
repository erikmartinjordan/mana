import React, { useContext, useEffect, useState } from 'react'
import Confetti                                   from 'react-confetti'
import moment                                     from 'moment'
import UserAvatar                                 from './UserAvatar'
import { db, onValue, ref, runTransaction }       from '../Functions/Firebase'
import UserContext                                from '../Functions/UserContext'
import accounts                                   from '../Rules/Accounts'
import '../Styles/Helper.css'

const Helper = () => {
    
    const [welcome, setWelcome] = useState(false)
    const { user }              = useContext(UserContext)
    
    useEffect(() => {
        
        if(user){
            
            onValue(ref(db, `users/${user.uid}`), snapshot => {
                
                if(snapshot.val()){
                 
                    let {welcomePremium, account} = snapshot.val()
                    
                    if(account && !welcomePremium){
                        
                        setWelcome(true)
                        
                    }
                    else{
                        
                        setWelcome(false)
                        
                    }
                    
                }
                
            })

            runTransaction(ref(db, `users/${user.uid}/lastAccess`), _ => moment().format('LLLL'))
            
        }
        
    }, [user])
    
    const closeWelcome = () => {
        
        runTransaction(ref(db, `users/${user.uid}/welcomePremium`), _ => true)
        
    }
    
    return(
        
        <React.Fragment>
            {user && welcome
            ? <div className = 'Welcome'>
                <Confetti/>
                <div className = 'Welcome-wrap'>
                    <UserAvatar user = {user} allowAnonymousUser = {true}/>
                    <h2>{user.displayName}</h2>
                    <p>Ahora eres PRO. Como tal, esta es tu nueva configuración:</p>
                    {accounts.premium.privileges.map(privilege => <li>{privilege}</li>)}
                    <button onClick = {() => closeWelcome()}>Vale</button>
                </div>
              </div>
            : null  
            }
        </React.Fragment>
        
    )
    
}

export default Helper