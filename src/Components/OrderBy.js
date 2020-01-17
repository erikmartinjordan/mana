import React, { useEffect } from 'react';
import '../Styles/OrderBy.css';

const OrderBy = (props) => {
    
    useEffect( () => { 
        // Drawing emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
    }) 
    
    //-------------------------------------------------------------
    //
    // Sort posts
    //
    //-------------------------------------------------------------    
    const orderBy = (type) => {
        
        let sorted;
        
        if(type === 'nuevo')       sorted = props.chat.sort( (a, b) => b.timeStamp - a.timeStamp );
        if(type === 'picante')     sorted = props.chat.sort( (a, b) => a.votes - b.votes );
        if(type === 'comentarios') sorted = props.chat.sort( (a, b) => {
            
            if(a.replies  && b.replies)   return Object.keys(b.replies).length - Object.keys(a.replies).length;
            if(!a.replies && b.replies)   return 1;
            if(a.replies  && !b.replies)  return -1;
            if(!a.replies && !b.replies)  return 0;
        });
        
        props.setChat(sorted);
        props.setSort(type);
    }
    
    return (
        <div className = 'OrderBy'>
            <div onClick = {() => orderBy('nuevo')}       className = {props.sort === 'nuevo' ? 'Selected' : null}>Nuevo 🔥</div>
            <div onClick = {() => orderBy('picante')}     className = {props.sort === 'picante' ? 'Selected' : null}>Picante 🌶</div>
            <div onClick = {() => orderBy('comentarios')} className = {props.sort === 'comentarios' ? 'Selected' : null}>Comentarios 💬</div>
        </div>
    );
}

export default OrderBy;