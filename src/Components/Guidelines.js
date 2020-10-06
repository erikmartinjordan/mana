import React    from 'react';
import '../Styles/Guidelines.css';

const Guidelines = () => {
  
    return (
        <div className = 'Guidelines'>
            <h2>Antes de publicar</h2>
            <p>Por favor, échale un vistazo a las guías de publicación. Si las seguimos, la comunidad crecerá de forma sana.</p>
            <p>Las guías de publicación pueden ir mutando con el tiempo o verse modificadas por sugerencias o comportamientos de los usuarios.</p>
            <ol>
                <li>Puedes escribir sobre lo que te apetezca: cualquier tema que pueda resultar de interés para la comunidad es bienvenido.</li>
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