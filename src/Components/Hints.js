import React, { useEffect, useState }  from 'react';
import { QuestionIcon }                from '@primer/octicons-react';
import '../Styles/Hints.css';

const Hints = ({mdFormat}) => {
    
    const [display, setDisplay] = useState(false);
    
    useEffect(() => {
        
        const handleClick = (e) => {
            
            if(e.target.parentNode.className !== 'Hints' && e.target.parentNode.className !== 'Cheatsheet')
                setDisplay(false);
            
        }
        
        if(display)
            window.addEventListener('click', handleClick);
        
        return () => window.removeEventListener('click', handleClick);
        
    }, [display]);
    
    return(
        
        <div className = 'Hints' style = {{fontSize: 'small'}}>
            { mdFormat
            ? <span onClick = {() => setDisplay(true)}><QuestionIcon/>Ver opciones de formato</span> 
            : null
            }
            { display
            ? <div className = 'Cheatsheet'>
                <div className = 'Title'>Títulos</div>
                <div style = {{fontSize: '17px'}}>#   Título 1</div>
                <div style = {{fontSize: '15px'}}>##  Título 2</div>   
                <div style = {{fontSize: '13px'}}>### Título 3</div>
                <hr></hr>
                <div className = 'Title'>Énfasis</div>
                <div style = {{fontStyle:  'italic'}}>*Texto en cursiva*</div>
                <div style = {{fontWeight: 'bold'}}>**Texto en negrita**</div>
                <hr></hr>
                <div className = 'Title'>Emojis</div>
                <div>Teclea <kbd>:</kbd> y verás un listado de emojis</div>
                <hr></hr>
                <div className = 'Title'>Citas</div>
                <div>> Ser o no ser, esa es la cuestión.</div>
                <hr></hr>
                <div className = 'Title'>Imágenes</div>
                <div>![Descripción](url)</div>
                <hr></hr>
                <div className = 'Title'>Listas sin orden</div>
                <div>- Elemento 1</div>
                <div>- Elemento 2</div>
                <div>   - Subelemento 2.1</div>
                <hr></hr>
                <div className = 'Title'>Listas ordenadas</div>
                <div>1. Elemento 1</div>
                <div>2. Elemento 2</div>
                <div>   - Subelemento 2.1</div>
                <hr></hr>
                <div className = 'Title'>Tablas</div>
                <code>
                    | Ciudad    | Vuelos    | Precio  |<br/>
                    | ----------|-----------| --------|<br/>
                    | Bangkok   | AC2014    |   600   |<br/>
                    | Phuket    | PH2585    |   452   |<br/>
                </code>
              </div>
            : null
            }
        </div>
        
    );
    
}

export default Hints;