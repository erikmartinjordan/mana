import React, { useEffect, useState } from 'react'
import Twemoji                        from './Twemoji'
import unmount                        from '../Functions/Unmount'
import '../Styles/Alert.css';

const Alert = ({ title, message, seconds = 3, setTitle, setMessage }) => {
    
    const [animation, setAnimation] = useState('')
    const [display, setDisplay] = useState(false)
    
    useEffect(() => {
        
        if(title && message){
            
            setDisplay(true)

            setTimeout(() => {

                unmount(setAnimation, () => {

                    setDisplay(false)
                    setMessage(null)
                    setTitle(null)

                })

            }, seconds * 1000)
            
        }
        
    }, [title, message, seconds, setMessage, setTitle])
    
    return(
        <React.Fragment>
            { display
            ? <div className = {`Alert ${animation}`}>
                <div className = 'Alert-Emoji'><Twemoji emoji = {'📮'}/></div>
                <div>
                    <div className = 'Title'>{title || 'Ups...'}</div>
                    <div className = 'Message'>{message}</div>  
                </div>
              </div>
            : null
            }
        </React.Fragment>
    )
    
}

export default Alert