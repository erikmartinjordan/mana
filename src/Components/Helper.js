import React, { useEffect, useState } from 'react';
import Confetti                       from 'react-confetti';
import firebase, { auth }             from '../Functions/Firebase';
import UserAvatar                     from '../Functions/UserAvatar';
import accounts                       from '../Rules/Accounts';
import '../Styles/Helper.css';

const Helper = () => {
    
    const [user, setUser]       = useState(null);
    const [welcome, setWelcome] = useState(false);
    
    useEffect(() => {
        
        auth.onAuthStateChanged(user => user ? setUser(user) : setUser(null));
        
    }, []);
    
    useEffect(() => {
        
        if(user){
            
            firebase.database().ref(`users/${user.uid}`).on('value', snapshot => {
                
                if(snapshot.val()){
                 
                    let {welcomePremium, account} = snapshot.val();
                    
                    if(account === 'premium' && !welcomePremium){
                        
                        setWelcome(true);
                        
                    }
                    else{
                        
                        setWelcome(false);
                        
                    }
                    
                }
                
            });
            
        }
        
    }, [user]);
    
    const closeWelcome = () => {
        
        firebase.database().ref(`users/${user.uid}/welcomePremium`).transaction(value => true);
        
    }
    
    return(
        
        <React.Fragment>
            {user && welcome
            ? <div className = 'Welcome'>
                <Confetti/>
                <div className = 'Welcome-wrap'>
                    <UserAvatar user = {user} allowAnonymousUser = {true}/>
                    <h2>{user.displayName}</h2>
                    <p>Ahora eres un usuario PRO. Como tal, esta es tu nueva configuración:</p>
                    {accounts.premium.privileges.map(privilege => <li>{privilege}</li>)}
                    <button className = 'bottom' onClick = {() => closeWelcome()}>Vale</button>
                </div>
              </div>
            : null  
            }
        </React.Fragment>
        
    );
    
}

export default Helper;