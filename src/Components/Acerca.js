import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import firebase, { auth, storageRef } from '../Functions/Firebase';
import DeleteFeature from '../Functions/DeleteFeature.js';
import Alert from '../Functions/Alert.js';
import { Link } from 'react-router-dom';
import '../Styles/Acerca.css';

const Acerca = () => {
    
    const today = new Date();
    const month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const [admin, setAdmin] = useState(null);
    const [alert, setAlert] = useState(false);
    const [content, setContent] = useState(null);
    const [data, setData] = useState(null);
    const [date, setDate] = useState(today.getDate() + ' de ' + month[today.getMonth()] + ' del ' + today.getFullYear());
    const [imgUrl, setImgUrl] = useState(null);
    const [title, setTitle] = useState(null);
    
    useEffect( () => {
        
        // Meta and title
        document.title = 'Acerca - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'De cómo nació el sitio web y los diferentes hitos hasta la fecha.'; 
        
        // Emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    })
    
    useEffect( () => {

        // Checking if admin is connected
        auth.onAuthStateChanged( user => { user && user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2' && setAdmin(true) });
        
        // Fetching data from Database
        firebase.database().ref('features/').on('value', snapshot => { snapshot.val() && setData(snapshot.val()) });
        
    }, []);
    
    const handleImageChange = (e) => {
        
        // Getting hte picture
        var reader = new FileReader();
        var file = e.target.files[0];
        
        // Uploading to Firebase
        storageRef.child('acerca/' + file.name).put(file).then( snapshot => setImgUrl(snapshot.downloadURL) );
    }
    
    const upload = () => {
        
        // Uploading to Firebase
        firebase.database().ref('features/').push({
            
            date: [today.getDate(), month[today.getMonth()], today.getFullYear()],
            description: content,
            pic: imgUrl,
            title: title

        })
        
        // Setting alert
        setAlert(true);
        
        // Disable notification after 2 seconds
        setTimeout( () => setAlert(false), 2000 );
        
    }
    
    const handleTextArea = (e) => {
        
        // Resizing textarea after key press 
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        
        // Setting content
        setContent(e.target.value);
    }

    return (
      <div className = 'Acerca'>
        
        {alert && <Alert title = '¡Olé!' message = 'Datos guardados'></Alert>}

        <h2>Acerca</h2>

        <div className = 'Intro'>
            <img src = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg'></img>
            <p>Hola 👋🏻<br></br> Soy Erik, el creador de Nomoresheet. Aquí encontrarás algunos de los hitos más relevantes hasta la fecha.</p>
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
                <textarea   onChange = {(e) => handleTextArea(e)}
                            className = 'Content'
                            placeholder = 'Contenido...'
                            value = {content}>
                </textarea>
                {imgUrl && <img src = {imgUrl}></img>}
                <div className = 'Buttons'>
                    <div className = 'Upload-Wrap'>
                        <input  onChange = {(e) => handleImageChange(e)}
                                className = 'Upload' 
                                type = 'file'>
                        </input>
                        <div>📸</div>
                    </div>
                    <button onClick = {() => upload()}className = 'send'>Añadir</button>
                </div>
            </div>,
            <div className = 'Separator'></div>]           
        }

        {data && Object.keys(data).reverse().map( key =>
            [<div className = 'Block'>
                {data[key].title && <h3>{data[key].title}</h3>}
                <div className = 'Date'>{data[key].date[0] + ' de ' + data[key].date[1] + ' del '  + data[key].date[2]}</div>
                <div className = 'Content'>
                    <div className = 'Text'>
                        {data[key].description && <ReactMarkdown source = {data[key].description}></ReactMarkdown>}
                        {data[key].pic  && <img src = {data[key].pic}></img>}
                    </div>
                </div>
                {admin && <DeleteFeature id = {key}></DeleteFeature>}
            </div>,
            <div className = 'Separator'></div>])
        }
      </div>
    );

}

export default Acerca;
