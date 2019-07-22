import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';
import '../Styles/VerifiedTag.css';

//--------------------------------------------------------------/
//
// This functions returns an array with uid and badge
//
//
//--------------------------------------------------------------/
const useVerifiedTag = () => {
    
    // Declaring variables
    const [verified, setVerified] = useState(null);
    
    // Getting if user is verified
    useEffect( () => { 
        
        firebase.database().ref('users/').once('value').then( snapshot => {
                
            if(snapshot) {

                var data  = snapshot.val();
                var object = {};
                var badge =  <div className = 'Verified'>
                                <div className = 'Tilde'>✓</div>
                                <div className = 'Tooltip'>Cuenta verificada</div>
                             </div>;
                
                var empty = <div className = 'Verified'></div>;
                
                //Object.keys(data).map( key => array.push([key, data[key].verified ? badge : null]) );
                Object.keys(data).map( key => object[key] = {'badge': data[key].verified ? badge : empty} );

            }

            setVerified(object);
    
        }) 
    
    }, []);
        
    return verified;
}

export default useVerifiedTag;