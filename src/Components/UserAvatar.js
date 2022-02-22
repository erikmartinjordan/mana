import React, { useState, useEffect } from 'react'
import { db, onValue, ref }           from '../Functions/Firebase'
import AnonymImg                      from '../Functions/AnonymImg'
import Loading                        from '../Components/Loading'
import '../Styles/UserAvatar.css'

const UserAvatar = ({ user, allowAnonymousUser }) => {  
    
    const [picture, setPicture] = useState(null)
    const randomImg = AnonymImg()
    
    useEffect(() => {
        
        let unsubscribe = onValue(ref(db, `users/${user.uid}`), snapshot => {
            
            let userInfo = snapshot.val()

            // Don't delete this variable
            // allowsAnonymousUser = true allows avatar change to anonymous in new post or reply
            if(allowAnonymousUser)
                setPicture(userInfo.avatar || userInfo.profilePic || randomImg)
            // allowsAnonymousUser = false prevents avatars from the main forum to change when the user is anonymous
            else
                setPicture(userInfo.profilePic || randomImg)
            
        })
        
        return () => unsubscribe()
        
    }, [user, randomImg])
        
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
