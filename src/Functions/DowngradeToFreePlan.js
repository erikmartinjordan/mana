import React, { useState, useEffect } from 'react';
import firebase, {auth}               from '../Functions/Firebase.js';
import '../Styles/DeletePost.css';

const DownGradeToFreePlan = (props) => {
    
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
            
            firebase.database().ref('users/' + user.uid  + '/account').transaction(value => 'free');
            firebase.database().ref('users/' + user.uid + '/subscriptionId').remove();
            
        }
        
        setConfirmation(false);
        
    }
    
    return(
        <React.Fragment>
            {confirmation &&
                <div className = 'Confirmation'>
                    <div className = 'Confirmation-Wrap'>
                        <p>¿Estás seguro de que quieres volver al plan gratuito?</p>
                        <button onClick = { () => handleDowngrade() }      className = 'Yes-Delete'>Sí, cambiar</button>
                        <button onClick = { () => setConfirmation(false) } className = 'No-Delete'>Cancelar</button>
                    </div>
                </div>
            }
        </React.Fragment>
    );
    
}

export default DownGradeToFreePlan;