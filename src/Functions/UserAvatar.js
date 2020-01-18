import React, { useState, useEffect } from 'react';
import firebase                       from '../Functions/Firebase.js';
import GetPoints                      from '../Functions/GetPoints.js';
import GetLevel                       from '../Functions/GetLevelAndPointsToNextLevel.js';
import Loading                        from '../Components/Loading.js';
import { ReactComponent as ProBadge } from '../Assets/pro.svg';
import '../Styles/UserAvatar.css';

const UserAvatar = (props) => {  
    
    const [picture, setPicture] = useState(null);
    const [premium, setPremium] = useState(null);
    
    const points     = GetPoints(props.user.uid);
    const level      = GetLevel(...points)[0];
    const percentage = GetLevel(...points)[2];
    
    useEffect( () => {
        
        let ref = firebase.database().ref('users/' + props.user.uid);
        
        let listener = ref.on( 'value', snapshot => {
            
            if(snapshot.val()){
                
                let capture = snapshot.val();
                
                capture.anonimo && props.allowAnonymousUser
                ? setPicture(capture.avatar)
                : setPicture(props.user.photoURL);
                
                capture.account === 'premium'
                ? setPremium(true)
                : setPremium(false);
            }
            
        });
        
        return () => ref.off('value', listener);
        
    }, [props.user]);
        
    return (
        <React.Fragment>
            { picture
            ? <div className = {`Progress ProgressBar-${percentage}`}>
                <img src = {picture}></img>
                {premium ? <ProBadge/> : null}
              </div>
            : <Loading type = 'Avatar'/> 
            }
        </React.Fragment>
    );
  
}

export default UserAvatar;
