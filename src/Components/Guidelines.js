import React    from 'react';
import '../Styles/Guidelines.css';

const Guidelines = () => {
  
    return (
        <div className = 'Guidelines'>
            <h2>Antes de publicar</h2>
            <ol>
                <li>Puedes escribir sobre lo que te apetezca: cualquier tema que pueda resultar de interés para la comunidad es bienvenido.</li>
                <li>Escribe como si estuvieses tomándote un café con alguien: sé amable, supón buena fe por parte de los demás, no seas puntilloso. </li>
                <li>Cita la fuente original de tu publicación poniendo la URL sin recortar al final del mensaje.</li>
                <li>Cuida tu ortografía o tu mensaje puede ser editado.</li>
                <li>Evita mensajes en mayúsculas o con excesivos puntos de exclamación. </li>
                <li>Evita títulos que empiecen con numerales. Por ejemplo, «5 mejores platos tailandeses» puede ser «Platos tailandeses que son una delicia».</li>
                <li>Si introduces enlaces de afiliado, tu mensaje será borrado.</li>
            </ol>
            <p>Las guías de publicación pueden ir mutando con el tiempo o verse modificadas por sugerencias o comportamientos de los usuarios.</p>
            <h3>Opciones de formato</h3>
            <div className = 'Cheatsheet'>
                <div className = 'Title'>Títulos</div>
                <div style = {{fontSize: '17px'}}>#   Título 1</div>
                <div style = {{fontSize: '15px'}}>##  Título 2</div>   
                <div style = {{fontSize: '13px'}}>### Título 3</div>
                <hr></hr>
                <div className = 'Title'>Énfasis</div>
                <div style = {{fontStyle:  'italic'}}>*Texto en cursiva*</div>
                <div style = {{fontWeight: 'bold'}}>**Texto en negrita**</div>
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
        </div>
    )
    
}

export default Guidelines;