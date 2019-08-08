import React from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from '../Functions/CheckoutForm.js';
import '../Styles/PaymentModal.css';

const PaymentModal = (props) => {

    return  <div className = 'Modal'>
                <StripeProvider apiKey = 'pk_live_genDzsOTtQmGTO8HUeiRYOc4004KnAdgau'>
                      <Elements>
                        <CheckoutForm percentage = {props.percentage} hide = {props.hide} price = '19'/>
                      </Elements>
                </StripeProvider>
            </div>
}

export default PaymentModal;