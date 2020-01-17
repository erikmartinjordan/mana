import React, { useEffect } from 'react';
import '../Styles/OrderBy.css';

const OrderBy = (props) => {
    
    console.log(props);
    
    useEffect( () => { 
        // Drawing emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
    }) 
    
    return (
        <div className = 'OrderBy'>
            <div onClick = {() => props.setTimeline('nuevo')}   className = {props.timeline === 'nuevo'   ? 'Selected' : null}>Nuevo 🔥</div>
            <div onClick = {() => props.setTimeline('picante')} className = {props.timeline === 'picante' ? 'Selected' : null}>Picante 🌶</div>
            <div onClick = {() => props.setTimeline('comentarios')} className = {props.timeline === 'comentarios' ? 'Selected' : null}>Comentarios 💬</div>
        </div>
    );
}

export default OrderBy;