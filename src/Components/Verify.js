import React, { useEffect, useState }  from 'react';
import firebase, { environment, auth } from '../Functions/Firebase';
import AnonymImg                       from '../Functions/AnonymImg';
import AnonymName                      from '../Functions/AnonymName';

const Verify = () => {
    
    const [status, setStatus] = useState('processing');
    
    useEffect(() => {
        
        let str = window.location.pathname.split('/').pop();
        let arr = str.split('&');
        
        let entries = arr.map(str => [str.split('=')[0], str.split('=')[1]]);
        let object  = Object.fromEntries(entries);
        
        let email = object.email;
        let token = object.token;
        
        signIn(email, token);
        
    }, []);
    
    const signIn = async (email, token) => {
        
        try{

            let { user, additionalUserInfo } = await firebase.auth().signInWithCustomToken(token);

            if(additionalUserInfo.isNewUser){

                await user.updateProfile({
                    'displayName': AnonymName(),
                    'photoURL': AnonymImg()
                });

                await user.updateEmail(email);
        
                firebase.database().ref(`users/${user.uid}/name`).transaction(value => user.displayName);
                firebase.database().ref(`users/${user.uid}/profilePic`).transaction(value => user.photoURL);

            }
    
            window.location.href = `${location.protocol}//${location.host}`;
            
        }
        catch(e){
            
            console.log(e.code, e.message);
            
        }
        
    }
    
    return(
        <div className = 'Verify'>
            { status === 'processing'
            ? 'Un momento, por favor...'
            : 'Verified'
            }
        </div>
    );
    
}

export default Verify;