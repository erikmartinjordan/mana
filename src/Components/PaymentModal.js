import React, { useState, useEffect }  from 'react';
import { Elements, StripeProvider }    from 'react-stripe-elements';
import CheckoutForm                    from '../Functions/CheckoutForm';
import { apiKey, environment }         from '../Functions/Firebase';
import '../Styles/PaymentModal.css';

const PaymentModal = (props) => {
    
    return  (
        <div className = 'Modal'>
            <StripeProvider apiKey = {apiKey}>
                <Elements>
                    <CheckoutForm 
                            account     = {props.account} 
                            hide        = {props.hide} 
                            plan        = {props.plan}
                            environment = {environment}
                    />
                </Elements>
            </StripeProvider>
        </div>
    );
    
}

export default PaymentModal;