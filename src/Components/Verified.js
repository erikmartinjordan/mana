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
        
        fetchData();
        
    }, []);
    
    return(
            <React.Fragment>
                {verified 
                ? <span className = 'Verified'>
                    <div className = 'Tilde'>✓</div>
                    <div className = 'Tooltip'>Cuenta verificada</div>
                  </span> 
                : null}
            </React.Fragment>
        );
}

export default Verified;