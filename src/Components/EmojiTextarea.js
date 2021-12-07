import React from 'react';
import '../Styles/EmojiTextarea.css';

const EmojiTextarea = ({ message, setMessage, maxLength, type }) => {

    const handleTextAreaSize = e => {

       if(type === 'reply')
            e.target.style.height = `${e.target.scrollHeight}px`

    }

    const handleMessage = e => {

        setMessage(e.target.value)

    }
  
    return (
        <div className = 'EmojiTextarea'>
            <textarea 
                id          = 'textarea'
                maxLength   = {maxLength}
                onChange    = {handleMessage}
                onKeyDown   = {handleTextAreaSize}
                placeholder = 'Mensaje...'
                value       = {message}
            />
        </div>
    )
  
}

export default EmojiTextarea;