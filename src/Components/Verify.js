import React, { useEffect }                                                  from 'react';
import firebase, { auth, signInWithCustomToken, updateEmail, updateProfile } from '../Functions/Firebase';
import AnonymImg                                                             from '../Functions/AnonymImg';
import AnonymName                                                            from '../Functions/AnonymName';

const Verify = () => {    
    
    useEffect(() => {
        
        let str = window.location.pathname.split('/').pop()
        let arr = str.split('&')
        
        let entries = arr.map(str => [str.split('=')[0], str.split('=')[1]])
        let object  = Object.fromEntries(entries)
        
        let email = object.email
        let token = object.token
        
        signIn(email, token)
        
    }, [])
    
    const signIn = async (email, token) => {
        
        try{

            let { user } = await signInWithCustomToken(auth, token)
            
            if(user.metadata.createdAt === user.metadata.lastLoginAt){

                await updateProfile(user, {
                    'displayName': AnonymName(),
                    'photoURL': AnonymImg()
                })

                await updateEmail(user, email)
        
                firebase.database().ref(`users/${user.uid}/name`).transaction(_ => user.displayName)
                firebase.database().ref(`users/${user.uid}/profilePic`).transaction(_ => user.photoURL)

            }
    
            window.location.href = `${location.protocol}//${location.host}`
            
        }
        catch(e){
            
            console.log(e.code, e.message)
            
        }
        
    }
    
    return(
        <div className = 'Verify'>
            Un momento, por favor...
        </div>
    );
    
}

export default Verify