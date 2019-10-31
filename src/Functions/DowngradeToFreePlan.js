import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import '../Styles/DeletePost.css';

//--------------------------------------------------------------/
//
//
// Downgrades a user to free plan
//
//
//--------------------------------------------------------------/
const downGrade = (props) => {
    
    const [confirmation, setConfirmation] = useState(true);
    const [user, setUser] = useState(null);
        
    useEffect( () => auth.onAuthStateChanged( user =>{ if(user) setUser(user) }), [] );
    
    const handleDowngrade = async () => {

        let response = await fetch("https://us-central1-payment-hub-6543e.cloudfunctions.net/downgradeNomoresheet", {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({subscriptionId: props.subscriptionId})
        });
                
        if (response.ok) {

            // Push account = premium for user
            firebase.database().ref('users/' + user.uid  + '/account').transaction(value => 'free');
            
            // Setting subscription id
            firebase.database().ref('users/' + user.uid + '/subscriptionId').remove();
            
        }
        
        setConfirmation(false);
        
    }
    
    var deletion = <React.Fragment>
                    {confirmation &&
                        <div className = 'Confirmation'>
                            <div className = 'Confirmation-Wrap'>
                                <p>¿Estás seguro de que quieres volver al plan gratuito?</p>
                                <button onClick = { () => handleDowngrade() }      className = 'Yes-Delete'>Sí, cambiar</button>
                                <button onClick = { () => setConfirmation(false) } className = 'No-Delete'>Cancelar</button>
                            </div>
                        </div>
                    }
                 </React.Fragment>;

    return deletion;
    
}

export default downGrade;