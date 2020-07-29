import React, { useEffect, useState } from 'react';
import Accounts                       from '../Rules/Accounts';
import GetPoints, { GetPointsLevel }  from '../Functions/GetPoints';
import GetLevel                       from '../Functions/GetLevelAndPointsToNextLevel';
import firebase, { auth }             from '../Functions/Firebase';
import '../Styles/Privileges.css';

const Privileges = () => {
    
    const [nextPrivilege, setNextPrivilege]             = useState(null);
    const [percentage, setPercentage]                   = useState(null);
    const [previousPrivileges, setPreviousPrivileges]   = useState([]);
    const [pointsNextPrivilege, setPointsNextPrivilege] = useState(null);
    const [user, setUser]                               = useState({});
    const points                                        = GetPoints(user.uid)[0];
    const level                                         = GetLevel(points)[0];
    
    useEffect( () => {
        
        auth.onAuthStateChanged( user => { 
            
            if(user){
                setUser(user);
            }
            else{
                setUser({});
            }
            
        });
        
    }, []);
    
    useEffect( () => {
    
        firebase.database().ref(`users/${user.uid}`).on('value', snapshot => {
            
            let userInfo = snapshot.val();
            
            if(userInfo){
                
                if(userInfo.account){
                    
                    let privileges = Accounts[userInfo.account].privileges;
                    
                    setNextPrivilege('Todos los privilegios desbloqueados');
                    setPreviousPrivileges(privileges);
                    setPointsNextPrivilege(points);
                    setPercentage(100);
                    
                }
                else{
                    
                    let rangeOfLevels          = Object.keys(Accounts['free']);
                    
                    let previousLevels         = [...rangeOfLevels].filter(num => num <=  level);
                    let previousPrivileges     = previousLevels.map(level => Accounts['free'][level].privilege);
                    
                    let lowClosestLevel        = Math.max(...rangeOfLevels.filter(num => num <= level));
                    let highClosestLevel       = Math.min(...rangeOfLevels.filter(num => num >  level));
                    let pointsLowClosestLevel  = Math.ceil(GetPointsLevel(lowClosestLevel));
                    let pointsHighClosestLevel = Math.ceil(GetPointsLevel(highClosestLevel));
                    let nextPrivilege          = Accounts['free'][highClosestLevel].privilege;
                    
                    let diff                   = pointsHighClosestLevel - pointsLowClosestLevel;
                    let percentage             = Math.floor(100 * (points - lowClosestLevel)/(diff));
                    
                    setPreviousPrivileges(previousPrivileges);
                    setNextPrivilege(nextPrivilege);
                    setPointsNextPrivilege(pointsHighClosestLevel);
                    setPercentage(percentage);
                    
                }
                
            }
            
        });
        
    }, [user, points]);
    
    return(
        <React.Fragment>
        { user.uid
        ? <div className = 'Privileges'>
            <span className = 'Title'>Privilegios</span>
            <div className = 'Next'>
                <span>🏆 {nextPrivilege}</span>
                <div className = 'Bar'>
                    <div className = 'Completed' style = {{width: percentage + '%'}}></div>
                </div>
                <div className = 'Comment'>{points}/{pointsNextPrivilege} puntos</div>
                <div className = 'Subheader'>Privilegios actuales</div>
                {previousPrivileges.map( privilege => <li key = {privilege}>{privilege}</li>)}
            </div>
          </div>
        : null 
        }
        </React.Fragment>
    );
}

export default Privileges;