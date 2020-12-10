import React, { useEffect, useState } from 'react';
import firebase                       from '../Functions/Firebase';
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
        <React.Fragment>
            {verified 
            ? <div className = 'Verified'>
                <div className = 'Tilde'>✓</div>
                <div className = 'Tooltip'>Cuenta verificada</div>
              </div> 
            : null}
        </React.Fragment>
    );
}

export default Verified;