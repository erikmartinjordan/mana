import React, { useState, useEffect } from 'react';
import firebase, { auth } from '../Functions/Firebase';
import { Link } from 'react-router-dom';
import '../Styles/Acerca.css';

const Acerca = () => {
    
    const today = new Date();
    const month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const [admin, setAdmin] = useState(null);
    const [content, setContent] = useState(null);
    const [data, setData] = useState(null);
    const [date, setDate] = useState(today.getDate() + ' de ' + month[today.getMonth()] + ' del ' + today.getFullYear());
    const [title, setTitle] = useState('Título');
    
    useEffect( () => {
        //Meta and title
        document.title = 'Acerca - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'De cómo nació el sitio web y los diferentes hitos hasta la fecha.'; 
        
        // Checking if admin is connected
        auth.onAuthStateChanged( user => { user && user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2' && setAdmin(true) });
        
        // Fetching data from Database
        !data && firebase.database().ref('features/').on('value', snapshot => { if(snapshot.val()) setData(snapshot.val().reverse()) });
        
        // Emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
    }, [data]);
    
    const upload = () => {
        
        
    }

    return (
      <div className = 'Acerca'>

        <h2>Acerca</h2>

        <div className = 'Intro'>
            <img src = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg'></img>
            <p>Hola 👋🏻<br></br> Soy Erik, el creador de Nomoresheet. En diciembre del 2015 nació esta web. Aquí encontrarás algunos de los hitos más relevantes hasta la fecha.</p>
        </div>
        
        {admin &&
            [<div className = 'Block'>
                <input      onChange = {(e) => setTitle(e.target.value)} 
                            className = 'Title' 
                            placeholder = 'Título...' 
                            value = {title}>
                </input>
                <div className = 'Date'>
                    {date}
                </div>
                <textarea   onChange = {(e) => setContent(e.target.value)}
                            className = 'Content'
                            placeholder = 'Contenido...'
                            value = {content}>
                </textarea>
                <div className = 'Buttons'>
                    <button className = 'Picture'>📸</button>
                    <button className = 'send'>Añadir</button>
                </div>
            </div>,
            <div className = 'Separator'></div>]           
        }

        {data && data.map((item, key) =>
            [<div className = 'Block'>
                {item.title ? <h3>{item.title}</h3> : null}
                <div className = 'Date'>{item.date[0] + ' de ' + item.date[1] + ' del '  + item.date[2]}</div>
                <div className = 'Content'>
                    <div className = 'Text'>
                        {item.description && <p>{item.description}</p>}
                        {item.list && Object.keys(item.list).map((value, key) => <li>{item.list[value]}</li>)}
                        {item.pic  && <img src = {item.pic}></img>}
                    </div>
                </div>
                {admin && <button className = 'Delete'>Eliminar</button>}
            </div>,
            <div className = 'Separator'></div>])
        }
      </div>
    );

}

export default Acerca;
