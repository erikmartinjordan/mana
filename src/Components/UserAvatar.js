import React, { useState, useEffect } from 'react'
import { db, onValue, ref }           from '../Functions/Firebase'
import GetPoints                      from '../Functions/GetPoints'
import GetLevel                       from '../Functions/GetLevelAndPointsToNextLevel'
import AnonymImg                      from '../Functions/AnonymImg'
import Loading                        from '../Components/Loading'
import '../Styles/UserAvatar.css'

const UserAvatar = ({allowAnonymousUser, user}) => {  
    
    const [picture, setPicture] = useState(null)
    const randomImg = AnonymImg()
    
    useEffect( () => {
        
        let unsubscribe = onValue(ref(db, `users/${user.uid}`), snapshot => {
            
            let userInfo = snapshot.val()
            
            if(userInfo){
                
                let capture = snapshot.val()
                
                if(capture.anonimo && allowAnonymousUser){
                    
                    setPicture(capture.avatar)
                    
                }
                else{
                    
                    setPicture(user.photoURL)
                }
                
            }
            else{
                
                setPicture(randomImg)
            }
            
        })
        
        return () => unsubscribe()
        
    }, [allowAnonymousUser, user, randomImg])
        
    return (
        <React.Fragment>
            { picture
            ? <div className = 'UserAvatar'>
                <img  loading = 'lazy' src = {picture} alt = {'Avatar'}/>
              </div>
            : <Loading type = 'Avatar'/> 
            }
        </React.Fragment>
    )
  
}

export default UserAvatar
