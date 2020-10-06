import React, { useState }          from 'react';
import { GiftIcon }                 from '@primer/octicons-react';
import { loadStripe }               from '@stripe/stripe-js';
import Loading                      from './Loading';
import { environment }              from '../Functions/Firebase';
import { apiKey }                   from '../Functions/Stripe';
import '../Styles/Donate.css';

const stripePromise = loadStripe(apiKey);

const Donate = ({ name, stripeUserId }) => {
    
    const [showDonation, setShowDonation] = useState(false);
    const [payment, setPayment]           = useState(false);
    const [quantity, setQuantity]         = useState(1);
    
    const pay = async () => {
        
        setPayment('processing');
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/stripeCreateSession';
        
        let response = await fetch(fetchURL, {
            
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                environment: environment,
                amount: quantity * 100,
                stripeUserId: stripeUserId,
                name: name
            })
            
        });
        
        if(response.ok){
            
            let stripe    = await stripePromise;
            let data      = await response.json();
            let sessionId = data.sessionId; 
            
            const { error } = await stripe.redirectToCheckout({ sessionId: sessionId });
            
            if(!error)
                setPayment('done');
            
        }
        
    }
    
    const handleLess = () => setQuantity(quantity - 1 > 0 ? quantity - 1 : 1);
    
    const handleMore = () => setQuantity(quantity + 1);
    
    return(
        
        <div className = 'Donate'>
            <button onClick = {() => setShowDonation(true)}>Hacer una aportación <GiftIcon size = {14}/></button> 
            { showDonation
            ? <div className = 'DonationBox'>
                    <div className = 'DonatioBox-Wrap'>
                        <p>¿De cuánto quieres hacer la aportación?</p>
                        <div className = 'Quantity'>
                            <button className = 'Less' onClick = {handleLess}>-</button>
                            <div>{quantity} €</div>
                            <button className = 'More' onClick = {handleMore}>+</button>
                        </div>
                        <button className = 'Pay' onClick = {pay}>
                            {payment === 'processing' ? <Loading tag = {'Procesando...'}/> : 'Pagar'}
                        </button>
                        <span>El usuario recibirá tu aportación al instante. Nomoresheet no recibe ninguna comisión por la transacción.</span>
                    </div>
                    <div className = 'Invisible' onClick = {() => setShowDonation(false)}></div>
              </div>
            : null  
            }
        </div>
        
    );
    
}

export default Donate;