import React, { useState, useEffect }   from 'react';
import ToggleButton                     from './ToggleButton';
import firebase, { auth, environment }  from '../Functions/Firebase';
import { OAuth }                        from '../Functions/Stripe';

const ConnectToStripe = ({user}) => {
    
    const [stripeUserId, setStripeUserId] = useState(null);
    
    useEffect(() => {
        
        firebase.database().ref(`users/${user.uid}/stripeUserId`).on('value', snapshot => {
           
            if(snapshot.val()) setStripeUserId(snapshot.val());
            else               setStripeUserId(null);
            
        });
        
    }, [user]);
    
    useEffect(() => {
        
        let url = window.location.href;
        
        if(url.includes('?') && user.uid){
         
            let res = transformURLparametersToObject(url);
            
            if(res.code){
                
                completeStripeConnection(res.code, user.uid);
                
            }
            
        }
        
    }, [user]);
    
    const transformURLparametersToObject = (url) => {
        
        let str = url.split('?')[1];
        
        let arr = str.split('&');
        
        let entries = arr.map(str => [str.split('=')[0], str.split('=')[1]]);
        
        let res = Object.fromEntries(entries);
        
        return res;
        
    }
    
    const connectToStripe = () => {
        
        let url = 'https://connect.stripe.com/oauth/authorize';
        
        window.location.href = `${url}?response_type=code&client_id=${OAuth.clientId}&scope=read_write`;
        
    }
    
    const disconnectStripe = async () => {
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/stripeAccountDisconnection';
        
        let response = await fetch(fetchURL, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                environment: environment,
                clientId: OAuth.clientId,
                stripeUserId: stripeUserId
            })
            
        });
        
        if(response.ok){
            
            firebase.database().ref(`users/${user.uid}/stripeUserId`).remove();
            
        }
        
    }
    
    const completeStripeConnection = async (authorizationCode) => {
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/stripeAccountConnection';
        
        let response = await fetch(fetchURL, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                authorizationCode: authorizationCode,
                environment: environment
            })
            
        });
        
        if(response.ok){
            
            let data = await response.json();
            
            let stripeUserId = data.stripeUserId;
            
            firebase.database().ref(`users/${user.uid}/stripeUserId`).transaction(value => stripeUserId);
            
        }
        
    }
    
    return(
        <div className = 'Toggle' onClick = {stripeUserId ? disconnectStripe : connectToStripe}>
            <div className = 'Tag'>Conecta con tu cuenta de Stripe y recibe donaciones. </div>
                { stripeUserId
                ? <ToggleButton status = 'on' />
                : <ToggleButton status = 'off'/>
                }
        </div>
    );
    
}

export default ConnectToStripe;