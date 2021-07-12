import { useEffect, useState } from 'react';
import { useHistory }          from 'react-router-dom';
import Fingerprint             from 'fingerprintjs';
import moment                  from 'moment';
import firebase                from '../Functions/Firebase';

let fingerprint = new Fingerprint().get();
let date  = moment();

const TrafficStats = () => {    
    
    const [sessionId, setSessionId] = useState(null);
    const history                   = useHistory();
    
    useEffect( () => {
        
        let ref = firebase.database().ref(`analytics/${date.format('YYYYMMDD')}/${fingerprint}`);
        
        let sessionId  = ref.push().key;
        
        let timeStamp = { 
            timeStampIni: date.valueOf(), 
            timeStampEnd: date.valueOf()
        };
        
        ref.child(`${sessionId}`).update(timeStamp);
        
        setSessionId(sessionId);
        
    }, []);
    
    useEffect( () => {
        
        let ref = firebase.database().ref(`analytics/${date.format('YYYYMMDD')}/${fingerprint}`);
        
        if(sessionId && !history.location.pathname.includes('token')){
            
            ref.child(`${sessionId}/pageviews`).push({ url: history.location.pathname });
            
        }
        
    }, [sessionId, history.location.pathname]);
    
    useEffect( () => {
        
        let scrollListener;
        
        let ref = firebase.database().ref(`analytics/${date.format('YYYYMMDD')}/${fingerprint}`);
        
        if(sessionId){
            
            scrollListener = window.addEventListener('scroll', () => {
                
                ref.child(`${sessionId}/timeStampEnd`).transaction( value => (new Date()).getTime() );
                
            });
        }
        
        return () => window.removeEventListener('scroll', scrollListener); 
        
    }, [sessionId, history.location.pathname]);
    
    return null;
    
}

export default TrafficStats;