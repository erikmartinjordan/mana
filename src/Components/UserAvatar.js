import React, { useState, useEffect } from 'react'
import { db, onValue, ref }           from '../Functions/Firebase'
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
                
                if(userInfo.avatar && allowAnonymousUser){
                    
                    setPicture(userInfo.avatar)
                    
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
