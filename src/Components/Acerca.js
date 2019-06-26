import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Acerca.css';

class Acerca extends Component {
    
  componentDidMount = () => {
      //Meta and title
      document.title = 'Acerca - Nomoresheet'; 
      document.querySelector('meta[name="description"]').content = 'De cómo nació el sitio web y los diferentes hitos hasta la fecha.'; 
      
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  }
  
  render() { 
      
    var data = [
        {
            'title': 'Mejoras sutiles',
            'date': [26, 'Junio', 2019],
            'description': 'Mejoras de la última versión:',
            'list': {
                'elem1': '💬 Añadidos últimos comentarios en la portada.',
                'elem2': '📈 Añadidas estadísticas de usuarios en perfil.',
                'elem3': '🌙 Creado modo noche.'
            }
        },
        {
            'title': 'Vuelvo a Tailandia',
            'date': [14, 'Junio', 2019],
            'description': 'Después de casi dos años, vuelvo a Tailandia otra vez. Ganas de crear cosas nuevas.',
        },
        {
            'title': 'Tres años',
            'date': [22, 'Diciembre', 2018],
            'description': 'Nace la página «acerca de», donde se recopilarán algunos hitos hasta la fecha. Esta pestaña está en construcción e ira modificándose a medida que pasen los días.',
        },
        {
            'title': 'Comunidad',
            'date': [13, 'Diciembre', 2017],
            'description': 'Se crea la comunidad. Un foro donde se habla del Sudeste Asiático, de Tailandia y de cualquier tema que pueda ser de interés para el resto de los mortales.',
        },
        {
            'title': 'Primer artículo',
            'date': [9, 'Diciembre', 2015],
            'description': 'Primer artículo en Nomoresheet. Fue publicado en un blog cutrillo de WordPress sin dominio propio. El título de ese primer artículo ha cambiado en innumerables ocasiones.',
        },
    ]
    
    return (
      <div className = 'Acerca'>
        
        <h2>Acerca</h2>
        
        <div className = 'Intro'>
            <img src = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg'></img>
            <p>Hola 👋🏻<br></br> Soy Erik, el creador de Nomoresheet. En diciembre del 2015 nació esta web. Aquí encontrarás algunos de los hitos más relevantes hasta la fecha.</p>
        </div>
        
        {data.map((item, key) =>
            [<div className = 'Block'>
                {item.title ? <h3>{item.title}</h3> : null}
                <div className = 'Date'><p>{item.date[0] + ' de ' + item.date[1] + ' del '  + item.date[2]}</p></div>
                    <div className = 'Content'>
                        <div className = 'Text'>
                            {item.description ? <p>{item.description}</p> : null}
                            {item.list ? Object.keys(item.list).map((value, key) => <li>{item.list[value]}</li>) : null}
                        </div>
                    </div>
            </div>,
            <div className = 'Separator'></div>])
        }
      </div>
    );
  }
}

export default Acerca;
