import React, { useState }  from 'react';
import { ShareAndroidIcon } from '@primer/octicons-react';
import Alert                from './Alert';
import '../Styles/CopyLink.css';

const CopyLink = ({postId, replyId, authorId}) => {
    
    const [message, setMessage] = useState(null);
    const [title, setTitle] = useState(null);

    const copy = () => {

        navigator.clipboard.writeText(`${window.location.host}/comunidad/post/${postId}${replyId ? `/#${replyId}` : ''}`);

        setTitle('¡Copiada!');
        setMessage('URL copiada en el portapapeles');

    }

    return(
        <div className = 'CopyLink' onClick = {copy}>
            <ShareAndroidIcon/>
            <Alert 
                title      = {title} 
                message    = {message} 
                seconds    = {3} 
                setTitle   = {setTitle} 
                setMessage = {setMessage}
            />
        </div>    
    );

}

export default CopyLink;