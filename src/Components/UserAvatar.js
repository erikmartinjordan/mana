import React, { useState, useEffect } from 'react';
import firebase                       from '../Functions/Firebase';
import GetPoints                      from '../Functions/GetPoints';
import GetLevel                       from '../Functions/GetLevelAndPointsToNextLevel';
import AnonymImg                      from '../Functions/AnonymImg';
import Loading                        from '../Components/Loading';
import Accounts                       from '../Rules/Accounts';
import { ReactComponent as ProBadge } from '../Assets/pro.svg';
import '../Styles/UserAvatar.css';

const UserAvatar = ({allowAnonymousUser, user}) => {  
    
    const [picture, setPicture] = useState(null);
    const [badge, setBadge]     = useState(null);
    
    const points     = GetPoints(user.uid);
    const level      = GetLevel(...points)[0];
    const percentage = GetLevel(...points)[2];
    const randomImg  = AnonymImg();
    
    useEffect( () => {
        
        let ref = firebase.database().ref(`users/${user.uid}`);
        
        let listener = ref.on( 'value', snapshot => {
            
            let userInfo = snapshot.val();
            
            if(userInfo){
                
                let capture = snapshot.val();
                
                if(capture.anonimo && allowAnonymousUser){
                    
                    setPicture(capture.avatar);
                    
                }
                else{
                    
                    setPicture(user.photoURL);
                }
                
                if(capture.account){
                    
                    setBadge(true);
                    
                }
                else{
                    
                    let rangeOfLevels = Object.keys(Accounts['free']);
                    let closestLevel  = Math.max(...rangeOfLevels.filter(num => num <= level));
                    let proBadge      = Accounts['free'][closestLevel].badge ? true : false;
                    
                    setBadge(proBadge);
                    
                }
                
            }
            else{
                
                setPicture(randomImg);
            }
            
        });
        
        return () => ref.off('value', listener);
        
    }, [allowAnonymousUser, user, level, randomImg]);
        
    return (
        <React.Fragment>
            { picture
            ? <div className = {`Progress ProgressBar-${percentage}`}>
                <img src = {picture} alt = {'Avatar'}></img>
                {badge ? <ProBadge/> : null}
              </div>
            : <Loading type = 'Avatar'/> 
            }
        </React.Fragment>
    );
  
}

export default UserAvatar;
