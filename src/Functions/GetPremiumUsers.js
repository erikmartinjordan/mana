import React, { useState, useEffect } from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
//
// This functions returns a object that contains premium users
//
//
//--------------------------------------------------------------/
const getPremiumUsers = () => {
    
    // Declaring variables
    const [premium, setPremium] = useState(null);
    
    // Getting if user is verified
    useEffect( () => { 
        
        firebase.database().ref('users/').once('value').then( snapshot => {
                
            if(snapshot) {

                var users  = snapshot.val();
                var object = {};
                                
                //Object.keys(data).map( key => array.push([key, data[key].verified ? badge : null]) );
                Object.keys(users).map( uid => object[uid] = {'account': users[uid].account} );

            }

            setPremium(object);
    
        }) 
    
    }, []);
        
    return premium;
}

export default getPremiumUsers;