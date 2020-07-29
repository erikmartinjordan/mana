import React, { useState, useEffect }  from 'react';
import {CardElement, injectStripe}     from 'react-stripe-elements';
import moment                          from 'moment';
import firebase, { auth }              from '../Functions/Firebase';
import Loading                         from '../Components/Loading';
import { ReactComponent as Checkmark } from '../Assets/checkmark.svg';
import 'moment/locale/es';

const CheckoutForm = ({plan, environment, stripe, hide}) => {
    
    const [payment, setPayment] = useState(false);
    const [user, setUser]       = useState(null);
    
    useEffect(() => {
        
        auth.onAuthStateChanged(user => { 
            
            if(user) 
                setUser(user);
            
        });
        
    }, []);
    
    const submit = async (ev) => {
        
        setPayment('processing');
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/';
        
        if(plan === 'premium')  fetchURL += 'subscriptionNomoresheet';
        if(plan === 'infinita') fetchURL += 'oneTimePaymentNomoresheet';
        
        let {token}  = await stripe.createToken({name: user.uid});
        
        let response = await fetch(fetchURL, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                environment: environment,
                stripeToken: token.id, 
                userEmail: user.email
            })
            
        });
        
        if(response.ok) {
            
            if(plan === 'premium'){
                
                let data = await response.json();
                let subscriptionId = data.subscriptionId; 
                
                firebase.database().ref(`users/${user.uid}/subscriptionId`).transaction(value => subscriptionId);
                firebase.database().ref(`users/${user.uid}/account`).transaction(value => 'premium');
                
            }
            
            if(plan === 'infinita'){
                
                firebase.database().ref(`users/${user.uid}/subscriptionId`).remove();
                firebase.database().ref(`users/${user.uid}/account`).transaction(value => 'infinita');
                
            }
            
            setPayment('success');
            
        }
    }
    
    return (
      <div className = 'Checkout'>
        {payment !== 'success'
        ? <div className = 'Modal-Wrap'>
                <h2>{user?.displayName}</h2>
                <p>Tendrás una tarifa <em>{plan}</em> hasta el
                { plan === 'premium'
                ? moment().locale('es').add(1, 'year').format('LL')
                : '∞'
                }
                </p>
                <CardElement hidePostalCode = {true}/>
                <div className = 'Total'>
                    <div className = 'Price'>
                        { plan === 'premium' 
                        ? <div>19 € <span className = 'info'>anuales</span></div>
                        : <div>29 € <span className = 'info'>en un único pago</span></div>
                        }
                    </div>
                    <button onClick = {hide} className = 'Cancel'>Cancelar</button>
                    <button onClick = {submit}>Pagar</button>   
                </div>
                <span className = 'Info-Payment'>
                    { plan === 'premium' 
                    ? 'Pago seguro vía Stripe. Podrás cancelar tu suscripción en cualquier momento.' 
                    : 'Pago seguro vía Stripe.'
                    }
                </span>
          </div>
        : <div className = 'Modal-Wrap Succeed'>
                <h2>¡Gracias!</h2>
                <Checkmark/>
                <p>Ahora ya eres miembro de Nomoresheet.</p>
                <button onClick = {hide}>Aceptar</button>
          </div> 
        }
      </div>
    );
}

export default injectStripe(CheckoutForm);