import React, { useContext, useState, useEffect } from 'react';
import moment                                     from 'moment';
import ReactMarkdown                              from 'react-markdown';
import Twemoji                                    from './Twemoji';
import firebase, { storageRef }                   from '../Functions/Firebase';
import DeleteFeature                              from '../Functions/DeleteFeature';
import UserContext                                from '../Functions/UserContext';
import '../Styles/Acerca.css';

const Acerca = () => {
    
    const today                     = moment();
    const { admin }                 = useContext(UserContext);
    const [content, setContent]     = useState('');
    const [data, setData]           = useState(null);
    const [imgUrl, setImgUrl]       = useState(null);
    const [title, setTitle]         = useState('');
    
    useEffect(() => {
        
        document.title = 'Acerca - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'De cómo nació el sitio web y los diferentes hitos hasta la fecha.';
        
    });
    
    useEffect(() => {
        
        let ref = firebase.database().ref('features');
        
        let listener = ref.on('value', snapshot => { 
            
            if(snapshot.val()){
                
                setData(snapshot.val());
            }
            
        });
        
        return () => ref.off('value', listener);
        
    }, []);
    
    const handleImageChange = async (e) => {
        
        var file = e.target.files[0];
        
        let snapshot = await storageRef.child(`acerca/${file.name}`).put(file);
        
        setImgUrl(snapshot.downloadURL);
    }
    
    const upload = () => {
        
        firebase.database().ref('features/').push({
            
            date: [today.format('D'), today.format('MMMM'), today.format('YYYY')],
            description: content,
            pic: imgUrl,
            title: title
            
        });
        
    }
    
    const handleTextArea = (e) => {
        
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        
        setContent(e.target.value);
    }

    return (
        <div className = 'Acerca'>
            <h1>Acerca</h1>
            <div className = 'Intro'>
                <img src = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg' alt = {'Erik Martín Jordán'}></img>
                <p>Hola, soy Erik, el creador de Nomoresheet. Hasta hace poco vivía en Bangkok, pero con el coronavirus se complicaron las cosas y ahora estoy viviendo en Barcelona hasta nuevo aviso.</p>
                <h2>¿Qué es Nomoresheet?</h2>
                <p>Nomoresheet empezó siendo un blog donde escribía sobre mis aventuras en el Sudeste Asiático allá por el 2016. Fueron buenos tiempos. Con el tiempo se ha convertido en una comunidad abierta de preguntas y respuestas donde cualquier tema es bienvenido.</p>
                <h2>Estructura de la web</h2>
                <p>Dos grandes bloques:
                    <li>Comunidad: Preguntas, noticias, miscelánea sobre cualquier tema que pueda incitar la curiosidad de los demás.</li>
                    <li>Blog: Artículos personales sobre cosas que voy aprendiendo o me van sucediendo.</li>
                </p>
                <p>El primer punto tiene más interés que el segundo, así que te animo a participar.</p>
                <h2>Cómo contactar</h2>
                <p>En 2020 he decidido apartarme de las redes sociales. Para cualquier cuestión, puedes utilizar la propia comunidad, si es algo más personal, mi cuenta de correo es <a href = 'mailto:hola@erikmartinjordan.com' target = '_blank' rel = 'nofollow noreferrer noopener' >hola@erikmartinjordan.com</a>.</p>
                <h2>Mutaciones</h2>
                <p>La web va evolucionando con el paso del tiempo, lo que antes veía con buenos ojos, mañana me parece que está mal. Aquí encontrarás los cambios más relevantes hasta la fecha.</p>
            </div>
            { admin
            ? <React.Fragment>
                <div className = 'Block'>
                    <input     
                        onChange    = {(e) => setTitle(e.target.value)} 
                        className   = 'Title' 
                        placeholder = 'Título...' 
                        value       = {title}>
                    </input>
                    <div className = 'Date'>
                        {`${today.format('D')} de ${today.format('MMMM')} del ${today.format('YYYY')}`}
                    </div>
                    <textarea   
                        onChange    = {(e) => handleTextArea(e)}
                        className   = 'Content'
                        placeholder = 'Contenido...'
                        value       = {content}>
                    </textarea>
                    {imgUrl && <img src = {imgUrl} alt = {'Imagen subida'}></img>}
                    <div className = 'Buttons'>
                        <div className = 'Upload-Wrap'>
                            <input  
                                onChange  = {(e) => handleImageChange(e)}
                                className = 'Upload' 
                                type      = 'file'>
                            </input>
                            <div><Twemoji emoji = {'📸'}/></div>
                        </div>
                        <button onClick = {upload} className = 'send'>Añadir</button>
                    </div>
                </div>
                <div className = 'Separator'></div>
              </React.Fragment>
            : null}
            { data
            ? <React.Fragment>
                {Object.keys(data).reverse().map(key =>
                    <React.Fragment key = {key}>
                        <div className = 'Block'>
                            {data[key].title && <h3>{data[key].title}</h3>}
                            <div className = 'Date'>{data[key].date[0] + ' de ' + data[key].date[1] + ' del '  + data[key].date[2]}</div>
                            <div className = 'Content'>
                                <div className = 'Text'>
                                    {data[key].description && <ReactMarkdown source = {data[key].description}></ReactMarkdown>}
                                    {data[key].pic  && <img src = {data[key].pic} alt = {'Imagen de actualización'}></img>}
                                </div>
                            </div>
                            {admin && <DeleteFeature id = {key}></DeleteFeature>}
                        </div>
                        <div className = 'Separator'></div>
                    </React.Fragment>
                )}
              </React.Fragment>
            : null}
        </div>
    );
    
}

export default Acerca;