import React, { useEffect, useState } from 'react';
import '../Styles/EmojiTextarea.css';

var emojis = {
    
    ':corazón': '❤️',
    ':brillante': '✨',
    ':suplicar': '🥺',
    ':fuego': '🔥',
    ':carcajada': '😂',
    ':sonrisa': '😊',
    ':validado': '✔️',
    ':encantado': '🥰',
    ':ok': '👍'
    
}

const EmojiTextarea = ({message, setMessage, maxLength}) => {
  
    const [display,     setDisplay]     = useState(false);
    const [lastwordIni, setLastwordIni] = useState('');
    const [lastwordEnd, setLastwordEnd] = useState('');
    
    const handleMessage = (e) => {
      
        let textarea = document.getElementById('textarea');
        let message  = textarea.value.replace('/\n/g', ' ');
        let caret    = textarea.selectionEnd;
        let l        = message.length;
        
        for(var start = 0, i = caret - 1; message[i] !== ' ' && i >= 0; i --) start = i;
        for(var end   = 0, i = caret - 1; message[i] !== ' ' && i <= l; i ++) end   = i + 1;
        
        let lastWord = message.substring(start, end);
        
        setMessage(e.target.value);
        setLastwordIni(start);
        setLastwordEnd(end);
      
        lastWord.startsWith(':') ? setDisplay(lastWord) : setDisplay(false);
        
    }
  
    return (
        <div className = 'EmojiTextarea'>
            <textarea 
                id          = 'textarea'
                maxLength   = {maxLength}
                onChange    = {handleMessage}
                onKeyDown   = {(e) => {e.target.style.height = `${e.target.scrollHeight}px`}}
                placeholder = 'Mensaje...'
                value       = {message}
            />
            <EmojiPicker 
                display     = {display}
                setDisplay  = {setDisplay}
                message     = {message}
                setMessage  = {setMessage}
                lastwordIni = {lastwordIni}
                lastwordEnd = {lastwordEnd}
                numEmojis   = {10}
            />
        </div>
    );
  
}

const EmojiPicker = ({display, setDisplay, message, setMessage, lastwordIni, lastwordEnd, numEmojis}) => {
    
    const [dummy, setDummy]       = useState(false);
    const [pos, setPos]           = useState({x: 0, y: 0});
    const [list, setList]         = useState([]);
    const [replaced, setReplaced] = useState(false);
    const [selected, setSelected] = useState(0);
    
    useEffect(() => {
        
        if(display){
            
            let filtered = Object.entries(emojis).filter(([key, value]) => key.startsWith(display)).slice(0, numEmojis);
            
            setList(filtered);
            setSelected(0);
            setDummy(true);
            
        }
        
    }, [display]);
    
    useEffect(() => {
        
        if(dummy){
            
            let rectangle  = document.getElementById('dummy').getBoundingClientRect();
            let rectangles = document.getElementById('dummy').getClientRects();
            
            let last = rectangles[rectangles.length - 1];
            
            let x = last.width;
            let y = rectangle.height; 
            
            setPos({x: x, y: y});
            setDummy(false);
            
        }
        
    }, [dummy]);
    
    useEffect(() => {
        
        if(replaced){
            
            document.getElementById('textarea').focus();
            document.getElementById('textarea').setSelectionRange(lastwordEnd, lastwordEnd);
            
            setReplaced(false);
            
        }
        
    }, [replaced]);
    
    const replaceWord = async (emoji) => {
        
        let replaced = `${message.substring(0, lastwordIni)}${emoji}${message.substring(lastwordEnd)}`;
        
        setMessage(replaced);
        setReplaced(true);
        setDisplay(false);
        
    }
  
    return(
        <React.Fragment>
            { display && list.length > 0
            ? <div className = 'EmojiPicker' style = {{position: 'absolute', left: pos.x, top: pos.y}}>
                <ul>
                    {list.map(([key, emoji], index) => 
                        <li key = {index} className = {index === selected ? 'Selected' : null} onClick = {() => replaceWord(emoji)}>{emoji} {key}</li>)
                    }
                </ul>
                <KeyboardController 
                    display     = {display}
                    setDisplay  = {setDisplay}
                    list        = {list}
                    selected    = {selected}
                    setSelected = {setSelected}
                    replaceWord = {replaceWord}
                />
            </div>
            : null    
            }
            { dummy ? <span id = 'dummy'>{message.substring(0, lastwordEnd)}</span> : null}
        </React.Fragment>
    );
  
}

const KeyboardController = ({display, setDisplay, list, selected, setSelected, replaceWord}) => {
    
    useEffect(() => {
        
        const handleKeydown = (e) => {
            
            if(e.key === 'ArrowDown'){
                
                e.preventDefault();
                setSelected((selected + 1) % list.length);
                
            }
            if(e.key === 'ArrowUp'){
                
                e.preventDefault();
                setSelected((selected + list.length - 1) % list.length);
                
            }
            if(e.key === 'Enter'){
                
                e.preventDefault();
                replaceWord(list[selected][1]);
                
            }
            if(e.key === 'Escape'){
                
                e.preventDefault();
                setDisplay(false);
                
            }
            
        }
        
        if(display){
            
            window.addEventListener('keydown', handleKeydown);
            
        }
        
        return () => removeEventListener('keydown', handleKeydown);
        
    }, [list, selected]); 
    
    return null;
    
}

export default EmojiTextarea;