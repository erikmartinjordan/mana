import React, { useState }  from 'react'
import { ShareAndroidIcon } from '@primer/octicons-react'
import Alert                from './Alert'
import '../Styles/CopyLink.css'

const CopyLink = ({ postId, replyId }) => {
    
    const [message, setMessage] = useState(null)
    const [title, setTitle] = useState(null)

    const copy = () => {

        navigator.clipboard.writeText(`${window.location.host}/p/${postId}${replyId ? `/#${replyId}` : ''}`)

        setTitle('¡Copiada!');
        setMessage('URL copiada en el portapapeles')

    }

    return(
        <div className = 'CopyLink Tooltip' onClick = {copy} data-tip = 'Comparte la publicación'>
            <ShareAndroidIcon/>
            <Alert 
                title      = {title} 
                message    = {message} 
                setTitle   = {setTitle} 
                setMessage = {setMessage}
            />
        </div>    
    );

}

export default CopyLink;