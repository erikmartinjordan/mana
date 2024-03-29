import React, { useContext, useEffect, useState } from 'react'
import Confetti                                   from 'react-confetti'
import moment                                     from 'moment'
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
                 
                let { welcomePremium, account } = snapshot.val() || {}
                        
                setWelcome(account && !welcomePremium)
                
            })

            runTransaction(ref(db, `users/${user.uid}/lastAccess`), _ => moment().format('LLLL'))
            
        }
        
    }, [user])
    
    const closeWelcome = () => {
        
        runTransaction(ref(db, `users/${user.uid}/welcomePremium`), _ => true)
        
    }
    
    return user && welcome
    ? <div className = 'Welcome'>
        <Confetti/>
        <div className = 'Welcome-wrap'>
            <h2>{user.displayName}</h2>
            <p>Ahora eres PRO. Como tal, esta es tu nueva configuración:</p>
            {accounts.premium.privileges.map(privilege => <li>{privilege}</li>)}
            <button onClick = {() => closeWelcome()}>Vale</button>
        </div>
        </div>
    : null  
    
}

export default Helper