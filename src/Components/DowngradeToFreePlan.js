import React, { useContext, useState }  from 'react'
import Loading                          from './Loading'
import { db, ref, remove, environment } from '../Functions/Firebase'
import UserContext                      from '../Functions/UserContext'
import '../Styles/DeletePost.css'

const DownGradeToFreePlan = ({ confirmation, setConfirmation, subscriptionId }) => {
    
    const [downgrade, setDowngrade] = useState(false)
    const { user } = useContext(UserContext)
    
    const handleDowngrade = async () => {
        
        setDowngrade('processing')
        
        let fetchURL = 'https://us-central1-payment-hub-6543e.cloudfunctions.net/downgradeMana'
        
        let response = await fetch(fetchURL, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                environment: environment,
                subscriptionId: subscriptionId
            })
        })
        
        if (response.ok) {

            remove(ref(db, `users/${user.uid}/account`))
            remove(ref(db, `users/${user.uid}/subscriptionId`))
            remove(ref(db, `users/${user.uid}/welcomePremium`))
            
        }
        
        setConfirmation(false)
        
    }
    
    return(
        <React.Fragment>
            { confirmation 
            ? <div className = 'Confirmation'>
                    <div className = 'Confirmation-Wrap'>
                        <p>¿Estás seguro de que quieres volver al plan gratuito?</p>
                        <button onClick = {handleDowngrade} className = 'Yes-Delete'>
                            { downgrade === 'processing'
                            ? <Loading/>
                            : 'Sí, cambiar'
                            }
                        </button>
                        <button onClick = {() => setConfirmation(false)} className = 'No-Delete'>Cancelar</button>
                    </div>
             </div>
            : null
            }
        </React.Fragment>
    )
    
}

export default DownGradeToFreePlan