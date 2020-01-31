import React, { useEffect, useState } from 'react';
import firebase                       from '../Functions/Firebase.js';
import '../Styles/VerifiedTag.css';

const Verified = (props) => {
    
    const [verified, setVerified] = useState(false);
    
    useEffect( () => {
        
        const fetchData = async () => {
            
            let snapshot = await firebase.database().ref(`users/${props.uid}/verified`).once('value');
            let verified = snapshot.val();
            
            setVerified(verified);
        }
        
        if(props.uid) fetchData();
        
    }, [props.uid]);
    
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