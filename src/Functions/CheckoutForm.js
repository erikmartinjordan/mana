import React, { useState, useEffect } from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import firebase, { auth } from '../Functions/Firebase.js';

const CheckoutForm = (props) => {
    
    const [payment, setPayment] = useState(false);
    const [price, setPrice] = useState('');
    const [user, setUser] = useState(null);
    const date = new Date();
    
    useEffect( () => auth.onAuthStateChanged( user => { if(user) setUser(user) }), []);
            
    const submit = async (ev) => {

        let {token} = await props.stripe.createToken({name: user.uid});
        let response = await fetch("http://localhost/nomoresheettest/stripe/examples/payment.php", {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({stripeToken: token.id, userEmail: user.email})
        });
        
        let data = await response.json()
        
        if (response.ok) {

            // Push account = premium for user
            firebase.database().ref('users/' + user.uid  + '/account').transaction(value => 'premium');
            
            // Setting subscription id
            firebase.database().ref('users/' + user.uid + '/subscriptionId').transaction(value => data.id)
            
            setPayment(true);
        }
    }

    return (
      <div className = 'Checkout'>
        {!payment
        ? <div className = 'Modal-Wrap'>
                <h2>{user && user.displayName}:</h2>
                <p>Después de introducir el número de la tarjeta, pagarás un importe de {props.price} € y serás miembro <em>premium</em> de Nomoresheet hasta el {date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() + 1)}.</p>
                <CardElement/>
                <div className = 'Total'>
                    <div className = 'Price'>{props.price} € <span className = 'info'>total</span></div>
                    <button onClick = {props.hide} className = 'Cancel'>Cancelar</button>
                    <button onClick = {() => submit()}>Pagar</button>
                </div>
                <span className = 'Info-Payment'>🔒 Pago seguro con Stripe</span>
          </div>
        : <div className = 'Modal-Wrap'>
                <h2>¡Gracias!</h2>
                <p>Ahora ya eres miembro. Este es tu nuevo avatar: 
                        <div className = {'Progress ProgressBar-' + props.percentage}>
                            {user && <img src = {user.photoURL}></img>}
                            <div className = 'Tag'>✨</div>
                        </div>
                </p>
                <button onClick = {props.hide}>Aceptar</button>
          </div> 
        }
      </div>
    );
}

export default injectStripe(CheckoutForm);