import React, { useEffect, useState } from 'react'
import { db, onValue, ref }           from '../Functions/Firebase'
import { VerifiedIcon }               from '@primer/octicons-react'
import '../Styles/VerifiedTag.css'

const Verified = ({uid}) => {
    
    const [verified, setVerified] = useState(false)
    
    useEffect( () => {
        
        if(uid) {

            onValue(ref(db, `users/${uid}/verified`), snapshot => {

                setVerified(snapshot.val() || false)

            }, { onlyOnce: true })

        }
        
    }, [uid])
    
    return(
        <div className = 'Verified'>
            {verified ? <VerifiedIcon/> : null}
        </div>
    )
}

export default Verified