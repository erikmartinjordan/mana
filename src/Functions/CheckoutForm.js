import React, { useState, useEffect } from 'react';
import {CardElement, injectStripe}    from 'react-stripe-elements';
import moment                         from 'moment';
import firebase, { auth }             from '../Functions/Firebase.js';
import Loading                        from '../Components/Loading.js';
import 'moment/locale/es';

const CheckoutForm = (props) => {
    
    const [payment, setPayment] = useState(false);
    const [price, setPrice]     = useState('');
    const [user, setUser]       = useState(null);
    
    useEffect(() => {
        
        auth.onAuthStateChanged(user => { 
            
            if(user) 
                setUser(user);
            
        });
        
    }, []);
    
    const submit = async (ev) => {
        
        setPayment('processing');
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/subscriptionNomoresheet';
        
        let {token}  = await props.stripe.createToken({name: user.uid});
        
        let response = await fetch(fetchURL, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({stripeToken: token.id, userEmail: user.email})
            
        });
        
        if (response.ok) {
            
            let data = await response.json();
            
            let subscriptionId = data.subscriptionId;
            
            firebase.database().ref('users/' + user.uid  + '/account').transaction(value => 'premium');
            firebase.database().ref('users/' + user.uid + '/subscriptionId').transaction(value => subscriptionId);
            
            setPayment(true);
        }
    }

    return (
      <div className = 'Checkout'>
        { payment === false || payment === 'processing'
        ? <div className = 'Modal-Wrap'>
                <h2>{user && user.displayName}:</h2>
                <p>Después de suscribirte, serás miembro <em>premium</em> de Nomoresheet hasta el {moment().locale('es').add(1, 'year').format('LL')}.</p>
                <CardElement hidePostalCode = {true}/>
                <div className = 'Total'>
                    <div className = 'Price'>{props.price} € <span className = 'info'>anuales</span></div>
                    <button onClick = {props.hide} className = 'Cancel'>Cancelar</button>
                    { payment === 'processing'
                    ? <Loading/>
                    : <button onClick = {() => submit()}>Pagar</button>
                    }   
                </div>
                <span className = 'Info-Payment'>🔒 Pago seguro con Stripe. Podrás cancelar tu suscripción en cualquier momento.</span>
          </div>
        : <div className = 'Modal-Wrap Succeed'>
                <h2>¡Gracias!</h2>
                <svg className = "checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className = "checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className = "checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                <p>Ahora ya eres miembro de Nomoresheet.</p>
                <button onClick = {props.hide}>Aceptar</button>
          </div> 
        }
      </div>
    );
}

export default injectStripe(CheckoutForm);