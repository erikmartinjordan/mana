import { useState, useEffect } from 'react'
import { db, onValue, ref } from '../Functions/Firebase'
import '../Styles/ProBadge.css'

const ProBadge = ({ user }) => {

    const [type, setType] = useState('free')

    useEffect(() => {

        if(user){

            let unsubscribe = onValue(ref(db,`users/${user.uid}/account`), snapshot => {
                
                if(snapshot.val() === 'premium' || snapshot.val() === 'infinita'){
                    
                    setType('pro')
                    
                }
                else{
    
                    setType('free')
    
                }
                
            })    
        
            return () => unsubscribe()

        }

    }, [user])

    return type === 'pro' ? <div className = 'ProBadge'>premium</div> : null

}

export default ProBadge