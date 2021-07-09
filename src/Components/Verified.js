import React, { useEffect, useState } from 'react';
import firebase                       from '../Functions/Firebase';
import { VerifiedIcon }               from '@primer/octicons-react';
import '../Styles/VerifiedTag.css';

const Verified = ({uid}) => {
    
    const [verified, setVerified] = useState(false);
    
    useEffect( () => {
        
        const fetchData = async () => {
            
            let snapshot = await firebase.database().ref(`users/${uid}/verified`).once('value');
            let verified = snapshot.val();
            
            setVerified(verified);
        }
        
        if(uid) 
            fetchData();
        
    }, [uid]);
    
    return(
        <div className = 'Verified'>
            {verified ? <VerifiedIcon/> : null}
        </div>
    );
}

export default Verified;