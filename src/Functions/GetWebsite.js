import { useState, useEffect } from 'react';
import firebase                from './Firebase';

const GetWebsite = (uid) => {
    
    const [web, setWeb] = useState(null);
    
    useEffect( () => { 
        
        if(uid){

            let ref = firebase.database().ref(`users/${uid}/web`);
            
            let listener = ref.on('value', snapshot => {
               
                let web = snapshot.val();
                
                setWeb(web);
                
            });

            return () => ref.off('value', listener);
            
        }
        
    }, [uid]);
    
    return web;
}

export default GetWebsite;