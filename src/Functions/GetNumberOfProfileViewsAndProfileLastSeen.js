import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetNumberOfProfileViewsAndProfileLastSeen = (userUid) => {
    
    const [profileLastSeen, setProfileLastSeen]  = useState(null);
    const [profileViews, setProfileViews]        = useState(0);
    
    useEffect( () => {
        
        if(userUid){
            
            firebase.database().ref(`users/${userUid}/profileViews`).transaction( value => {
                
                setProfileViews(value ? value : 0);
                
                return value + 1;
            });
            
            firebase.database().ref(`users/${userUid}/profileLastSeen`).transaction( value => {
                
                setProfileLastSeen(value ? value : 0);
                
                return (new Date()).getTime();
            });
        }
        
    }, [userUid]);
    
    return [profileViews, profileLastSeen];
    
}

export default GetNumberOfProfileViewsAndProfileLastSeen;