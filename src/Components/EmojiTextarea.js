const EmojiTextarea = () => {
  
    const [message,     setMessage]     = useState(''); 
    const [display,     setDisplay]     = useState(false);
    const [lastwordIni, setLastwordIni] = useState('');
    const [lastwordEnd, setLastwordEnd] = useState('');
    
    const handleMessage = (e) => {
      
        let textarea = document.getElementById('textarea');
        let message  = textarea.value.replace('\n', ' ');
        let caret    = textarea.selectionEnd;
        let l        = message.length;
        
        for(var start = 0, i = caret - 1; message[i] !== ' ' && i >= 0; i --) start = i;
        for(var end   = 0, i = caret - 1; message[i] !== ' ' && i <= l; i ++) end   = i + 1;
        
        let lastWord = message.substring(start, end);
      
        lastWord.startsWith(':') ? setDisplay(lastWord) : setDisplay(false);
        
        setMessage(e.target.value);
        setLastwordIni(start);
        setLastwordEnd(end);
        
    }
  
    return (
        <React.Fragment>
            <textarea 
                id          = 'textarea'
                onChange    = {handleMessage}
                placeholder = 'Message...'
                value       = {message}
            />
            <EmojiPicker 
                display     = {display}
                setDisplay  = {setDisplay}
                message     = {message}
                setMessage  = {setMessage}
                lastwordIni = {lastwordIni}
                lastwordEnd = {lastwordEnd}
            />
        </React.Fragment>
    );
  
}

const EmojiPicker = ({display, setDisplay, message, setMessage, lastwordIni, lastwordEnd}) => {
    
    const [list, setList] = useState([]);
    const [replaced, setReplaced] = useState(false);
    const [selected, setSelected] = useState(0);
    
    console.log(selected);
    
    const emojis = {
        
        ':risa:': '😊',
        ':lloro:': '😢',
        ':enfado:': '😠'
        
    }
    
    useEffect(() => {
        
        const handleKeydown = (e) => {
            
            let filtered = Object.entries(emojis).filter(([key, value]) => key.startsWith(display));

            if(e.key === 'ArrowDown'){
                e.preventDefault();
                setSelected((selected + 1) % filtered.length);
            }
            if(e.key === 'ArrowUp'){
                e.preventDefault();
                setSelected((selected + filtered.length - 1) % filtered.length);
            }

            if(e.key === 'Enter'){
                e.preventDefault();
                replaceWord(Object.values(emojis)[selected]);
            }
            
            setList(filtered);
        }
        
        if(display){
            
            window.addEventListener('keydown', handleKeydown);
            
        }
        
        return () => removeEventListener('keydown', handleKeydown);
        
    }, [display, selected]);   
        
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
     
    }
  
    return(
        <React.Fragment>
            { display
                ? <ul>
                    {list.map(([key, emoji]) => <li onClick = {() => replaceWord(emoji)}>{emoji}</li>)}
                  </ul>
                : null
            }
        </React.Fragment>
    );
  
}