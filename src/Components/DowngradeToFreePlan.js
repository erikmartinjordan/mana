import React, { useContext, useState }  from 'react';
import Loading                          from './Loading';
import firebase, { environment }        from '../Functions/Firebase';
import UserContext                      from '../Functions/UserContext';
import '../Styles/DeletePost.css';

const DownGradeToFreePlan = (props) => {
    
    const [confirmation, setConfirmation] = useState(true);
    const [downgrade, setDowngrade]       = useState(false);
    const { user }                        = useContext(UserContext);
    
    const handleDowngrade = async () => {
        
        setDowngrade('processing');
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/downgradeNomoresheet';
        
        let response = await fetch(fetchURL, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                environment: environment,
                subscriptionId: props.subscriptionId
            })
        });
        
        if (response.ok) {
            
            firebase.database().ref(`users/${user.uid}/account`).remove();
            firebase.database().ref(`users/${user.uid}/subscriptionId`).remove();
            firebase.database().ref(`users/${user.uid}/welcomePremium`).remove();
            
        }
        
        setConfirmation(false);
        
    }
    
    return(
        <React.Fragment>
            {confirmation &&
                <div className = 'Confirmation'>
                    <div className = 'Confirmation-Wrap'>
                        <p>¿Estás seguro de que quieres volver al plan gratuito?</p>
                        <button onClick = {() => handleDowngrade() } className = 'Yes-Delete'>
                            { downgrade === 'processing'
                            ? <Loading/>
                            : 'Sí, cambiar'
                            }
                        </button>
                        <button onClick = {() => setConfirmation(false) } className = 'No-Delete'>Cancelar</button>
                    </div>
                </div>
            }
        </React.Fragment>
    );
    
}

export default DownGradeToFreePlan;