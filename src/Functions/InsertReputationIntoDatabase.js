import React, {useEffect, useState}     from 'react';
import firebase, {auth}                 from './Firebase.js';

//--------------------------------------------------------------/
//
// This function inserts new reputation value to database
//
//--------------------------------------------------------------/
const nmsInsertReputation = (uid, reputation) => {
    
    firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).set(reputation);    
    
}

export default nmsInsertReputation;