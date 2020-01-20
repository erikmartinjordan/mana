import React, { useState, useEffect }             from 'react';
import { Link }                                   from 'react-router-dom';
import ReactMarkdown                              from 'react-markdown';
import firebase, { auth, storageRef, fetchAdmin } from '../Functions/Firebase';
import DeleteFeature                              from '../Functions/DeleteFeature.js';
import Alert                                      from '../Functions/Alert.js';
import '../Styles/Acerca.css';

const Acerca = () => {
    
    const today = new Date();
    const month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const [admin, setAdmin]         = useState(null);
    const [alert, setAlert]         = useState(false);
    const [content, setContent]     = useState(null);
    const [data, setData]           = useState(null);
    const [date, setDate]           = useState(`${today.getDate()} de ${month[today.getMonth()]} del ${today.getFullYear()}`);
    const [imgUrl, setImgUrl]       = useState(null);
    const [title, setTitle]         = useState(null);
    
    useEffect( () => {
        
        document.title = 'Acerca - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'De cómo nació el sitio web y los diferentes hitos hasta la fecha.'; 
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    })
    
    useEffect( () => {
        
        auth.onAuthStateChanged( async user => {
            
            if(user){
                
                let admin = await fetchAdmin(user);
                
                setAdmin(admin);
            }
            else{
                setAdmin(false);
            }
            
        });
        
        firebase.database().ref('features/').on('value', snapshot => { 
            
            if(snapshot.val())
                setData(snapshot.val());
        });
        
    }, []);
    
    const handleImageChange = async (e) => {
        
        var reader = new FileReader();
        var file = e.target.files[0];
        
        let snapshot = await storageRef.child(`acerca/${file.name}`).put(file)
        
        setImgUrl(snapshot.downloadURL);
    }
    
    const upload = () => {
        
        firebase.database().ref('features/').push({
            
            date: [today.getDate(), month[today.getMonth()], today.getFullYear()],
            description: content,
            pic: imgUrl,
            title: title

        })
        
        setAlert(true);
        
        setTimeout( () => setAlert(false), 2000 );
        
    }
    
    const handleTextArea = (e) => {
        
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        
        setContent(e.target.value);
    }

    return (
        <div className = 'Acerca'>
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
