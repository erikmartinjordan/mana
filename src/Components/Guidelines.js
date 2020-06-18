import React, { useEffect } from 'react';
import { Link }             from 'react-router-dom';
import '../Styles/Guidelines.css';

const Guidelines = () => {
  
    return (
        <div className = 'Guidelines'>
            <h2>Antes de publicar</h2>
            <ol>
                <li>Puedes escribir sobre lo que te apetezca: desde Tailandia hasta cualquier otro tema que pueda resultar de interés para la comunidad.</li>
                <li>Escribe como si estuvieses tomándote un café con alguien: sé amable, supón buena fe por parte de los demás, no seas puntilloso. </li>
                <li>Cita la fuente original de tu publicación poniendo la URL sin recortar al final del mensaje.</li>
                <li>Cuida tu ortografía.</li>
                <li>Evita mensajes en mayúsculas o con excesivos puntos de exclamación. </li>
                <li>Evita títulos que empiecen con numerales. Por ejemplo, «5 mejores platos tailandeses» puede ser «Platos tailandeses que son una delicia».</li>
                <li>Si introduces enlaces de afiliado, tu mensaje será borrado.</li>
            </ol>
        </div>
    );
    
}

export default Guidelines;