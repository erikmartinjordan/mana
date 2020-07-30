import React from 'react';
import '../Styles/Norms.css';

const Norms = () => {
    
    return(
        <div className = 'Norms'>
            <span className = 'Title'>Antes de publicar</span>
            <ol>
                <li className = 'Bien'>Puedes escribir sobre lo que te apetezca: cualquier tema que pueda resultar de interés es bienvenido.</li>
                <li className = 'Bien'>Escribe como si estuvieses tomándote un café con alguien: sé amable, supón buena fe por parte de los demás, no seas puntilloso. </li>
                <li className = 'Bien'>Cita la fuente original de tu publicación poniendo la URL sin recortar al final del mensaje.</li>
                <li className = 'Bien'>Cuida tu ortografía.</li>
                <li className = 'Mal'>Evita mensajes en mayúsculas o con excesivos puntos de exclamación. </li>
                <li className = 'Mal'>Evita títulos que empiecen con numerales. Por ejemplo, «5 mejores platos tailandeses» puede ser «Platos tailandeses que son una delicia».</li>
                <li className = 'Mal'>Si introduces enlaces de afiliado, tu mensaje será borrado.</li>
            </ol>
        </div>);
}

export default Norms;