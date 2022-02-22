import React, { useContext, useState, useEffect }                                            from 'react'
import moment                                                                                from 'moment'
import ReactMarkdown                                                                         from 'react-markdown'
import remarkGfm                                                                             from 'remark-gfm'
import Twemoji                                                                               from './Twemoji'
import DeleteFeature                                                                         from './DeleteFeature'
import { db, onValue, getDownloadURL, push, ref, storage, storageRef, uploadBytesResumable } from '../Functions/Firebase'
import UserContext                                                                           from '../Functions/UserContext'
import '../Styles/Acerca.css'

const Acerca = () => {
    
    const today                 = moment()
    const { admin }             = useContext(UserContext)
    const [content, setContent] = useState('')
    const [data, setData]       = useState(null)
    const [imgUrl, setImgUrl]   = useState(null)
    const [title, setTitle]     = useState('')
    
    useEffect(() => {
        
        document.title = 'Acerca — Nomoresheet' 
        document.querySelector('meta[name="description"]').content = 'De cómo nació el sitio web y los diferentes hitos hasta la fecha.'
        
    })
    
    useEffect(() => {
        
        let featuresRef = ref(db, 'features')
        
        let unsubscribe = onValue(featuresRef, snapshot => { 
            
            if(snapshot.val()){
                
                setData(snapshot.val())
            }
            
        })
        
        return () => unsubscribe()
        
    }, [])
    
    const handleImageChange = async (e) => {
        
        let file = e.target.files[0]

        let imageRef = storageRef(storage, `acerca/${file.name}`)
        
        let snapshot = await uploadBytesResumable(imageRef, file)
        
        let url = await getDownloadURL(snapshot.ref)
        
        setImgUrl(url)
    }
    
    const upload = () => {
        
        push(ref(db, 'features'), {
            
            date: [today.format('D'), today.format('MMMM'), today.format('YYYY')],
            description: content,
            pic: imgUrl,
            title: title
            
        })
        
    }
    
    const handleTextArea = (e) => {
        
        e.target.style.height = 'inherit'
        e.target.style.height = `${e.target.scrollHeight}px` 
        
        setContent(e.target.value)
    }

    const components = {
        
        image: props => <img src = {props.src} onError = {(e) => e.target.style.display = 'none'} alt = {'Imagen de artículo'}></img>,
        table: props => <div className = 'TableWrap'><table>{props.children}</table></div>
        
    }

    return (
        <div className = 'Acerca'>
            <h1>Acerca</h1>
            <div className = 'Intro'>
                <img src = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg' alt = {'Erik Martín Jordán'}></img>
                <p>Hola, soy Erik, el creador de Nomoresheet. Hasta hace poco vivía en Bangkok, pero con el coronavirus se complicaron las cosas y ahora estoy viviendo en Barcelona hasta nuevo aviso.</p>
                <h2>¿Qué es Nomoresheet?</h2>
                <p>Nomoresheet empezó siendo un blog donde escribía sobre mis aventuras en el Sudeste Asiático allá por el 2016. Fueron buenos tiempos. Con el tiempo se ha convertido en una comunidad abierta de preguntas y respuestas donde cualquier tema es bienvenido. Algunas personas publican noticias, otras curiosidades, otras reflexiones... Por encima de todo, Nomoresheet deja vía libre a cualquier tema, siempre que se publique con buenas formas.</p>
                <h2>Cómo contactar</h2>
                <p>Para cualquier cuestión, puedes utilizar la propia comunidad, si es algo más personal, mi cuenta de correo es <a href = 'mailto:hola@erikmartinjordan.com' target = '_blank' rel = 'nofollow noreferrer noopener' >hola@erikmartinjordan.com</a>.</p>
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
                            {<h3>{data[key].title}</h3>}
                            <div className = 'Date'>{data[key].date[0] + ' de ' + data[key].date[1] + ' del '  + data[key].date[2]}</div>
                            <div className = 'Content'>
                                <div className = 'Text'>
                                    { <ReactMarkdown 
                                        children = {data[key].description}
                                        components = {components}
                                        remarkPlugins = {[remarkGfm]}
                                      /> 
                                    }
                                    { data[key].pic 
                                    ? <img src = {data[key].pic} alt = {'Imagen de actualización'}/> 
                                    : null}
                                </div>
                            </div>
                            { admin
                            ? <DeleteFeature id = {key}></DeleteFeature>
                            : null}
                        </div>
                        <div className = 'Separator'></div>
                    </React.Fragment>
                )}
              </React.Fragment>
            : null}
        </div>
    )
    
}

export default Acerca