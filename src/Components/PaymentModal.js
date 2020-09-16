import React, { useState, useEffect }                    from 'react';
import moment                                            from 'moment';
import { loadStripe }                                    from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import Loading                                           from '../Components/Loading';
import { apiKey }                                        from '../Functions/Stripe';
import firebase, { auth, environment }                   from '../Functions/Firebase';
import { premium, infinita }                             from '../Functions/Stripe';
import { ReactComponent as Checkmark }                   from '../Assets/checkmark.svg';
import 'moment/locale/es';
import '../Styles/PaymentModal.css';

const PaymentModal = (props) => {
    
    const stripePromise = loadStripe(apiKey);
    
    return  (
        <div className = 'Modal'>
            <Elements stripe = {stripePromise}>
                <CheckoutForm account = {props.account} hide = {props.hide}  plan = {props.plan}/>
            </Elements>
        </div>
    );
    
}

export default PaymentModal;

const CheckoutForm = ({hide, plan}) => {
    
    const [payment, setPayment] = useState(false);
    const [user, setUser]       = useState(null);
    const stripe                = useStripe();
    const elements              = useElements();
    
    useEffect(() => {
        
        auth.onAuthStateChanged(user => { 
            
            if(user) 
                setUser(user);
            
        });
        
    }, []);
    
    const submit = async (ev) => {
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/';
        let price;
        
        if(plan === 'premium'){
            
            fetchURL += 'subscriptionNomoresheet';
            price     = premium.id;
            
        }
        if(plan === 'infinita'){
            
            fetchURL += 'oneTimePaymentNomoresheet';
            price     = infinita.id;
            
        }
        
        const { error, token } = await stripe.createToken(elements.getElement(CardElement));
        
        if(!error){
            
            setPayment('processing');
            
            let response = await fetch(fetchURL, {
                
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    environment: environment,
                    priceId: price,
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
        
    }
    
    return (
      <div className = 'Checkout'>
        {payment !== 'success'
        ? <div className = 'Modal-Wrap'>
                <h2>{user?.displayName}</h2>
                <p>Tendrás una tarifa <em>{plan}</em> hasta el
                { plan === 'premium'
                ? ` ${moment().locale('es').add(1, 'year').format('LL')}.`
                : ' ∞.'
                }
                </p>
                <CardElement options = {{hidePostalCode: true}}/>
                <div className = 'Total'>
                    <div className = 'Price'>
                        { plan === 'premium' 
                        ? <div>{premium.value} €  <span className = 'info'>anuales</span></div>
                        : <div>{infinita.value} € </div>
                        }
                    </div>
                    <button onClick = {hide} className = 'Cancel'>Cancelar</button>
                    <button onClick = {submit}>
                        { payment === 'processing'
                        ? <Loading/>
                        : 'Pagar'
                        }
                    </button>   
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
                <p>El pago se ha realizado de forma correcta.</p>
                <button onClick = {hide}>Aceptar</button>
          </div> 
        }
      </div>
    );
}