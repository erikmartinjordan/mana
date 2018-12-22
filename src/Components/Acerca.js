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
            'title': 'Tres años',
            'date': [22, 'Diciembre', 2018],
            'description': 'Hoy ha nacido esta página donde se recopilarán algunos hitos hasta la fecha. Esta pestaña está en construcción e ira modificándose a medida que pasen los días.',
        },
        {
            'title': 'Prueba',
            'date': [9, 'Diciembre', 2015],
            'description': 'Primer artículo en Nomoresheet. Fue publicado en un blog cutrillo de WordPress sin dominio propio. El título de ese primer artículo ha cambiado en innumerables ocasiones.',
            'emoji': '🎈',
        },
    ]
    
    return (
      <div className = 'Acerca'>
        
        
        <h2>Acerca</h2>
        
        <div className = 'Intro'>
            <img src = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg'></img>
            <p>Hola 👋🏻<br></br> Soy Erik, el creador de Nomoresheet. En diciembre del 2015 nació esta web y bla, bla, bla... Estoy reconstruyendo algunos de los hitos más relevantes hasta la fecha...</p>
        </div>
        
        {data.map((item, key) =>
            <div className = 'Block'>
                <div className = 'Date'><p>{item.date[0]} de {item.date[1]} del {item.date[2]}</p></div>
                    <div className = 'Content'>
                        <div className = 'Emoji'>{item.emoji}</div>
                        <div className = 'Text'>
                            <p>{item.description}</p>
                            <img src = {item.img}></img>
                        </div>
                    </div>
            </div>)
        }
      </div>
    );
  }
}

export default Acerca;
