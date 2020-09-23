import React from 'react';
import '../Styles/OrderBy.css';

const OrderBy = ({timeline, setTimeline}) => {
    
    return (
        <div className = 'OrderBy'>
            <div onClick = {() => setTimeline('nuevo')}  className = {timeline === 'nuevo' ? 'Selected' : null}>Nuevo</div>
            <div onClick = {() => setTimeline('picante')} className = {timeline === 'picante' ? 'Selected' : null}>Picante</div>
            <div onClick = {() => setTimeline('comentarios')} className = {timeline === 'comentarios' ? 'Selected' : null}>Comentarios </div>
        </div>
    );
    
}

export default OrderBy;