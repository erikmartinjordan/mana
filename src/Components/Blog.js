import React, { useState, useEffect } from 'react';
import firebase, {auth, provider} from '../Functions/Firebase.js';
import Data from '../Posts/_data.js';
import { Link } from 'react-router-dom';
import Login from './Login.js';
import '../Styles/Blog.css';

const Blog = () => {

    const [archive, setArchive] = useState([]);
    const [articleData, setArticleData] = useState(null);
    const [abstract, setAbstract] = useState(null);
    const [displayPosts, setDisplayPosts] = useState(10);
    const [filter, setFilter] = useState('Nuevo');
    const [img, setImg] = useState({});
    const [login, setLogin] = useState(false);
    const [user, setUser]  = useState(null);
    
    useEffect( () => {
        
        //Metas and titles
        document.title = 'Blog - Nomoresheet'; 
        document.querySelector('meta[name="description"]').content = 'Artículos de Nomoresheet.'; 
        
        // Emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );  
    })
    
    
    useEffect( () => {
        
        // Is user authenticated?
        auth.onAuthStateChanged( user => { if(user) setUser(user)} );
        
        // Getting views
        firebase.database().ref('articles/').on('value', snapshot => { if(snapshot.val()) setArticleData(snapshot.val()) });

    }, []);
    
    const loginUser = () => { auth.signInWithPopup(provider).then( result => setUser(result.user) ); }
    
    const loginBox = () => {
        
        return <div className = 'Login-Box'>
                    <p>Accede a la comunidad</p>
                    <p><span className = 'Nms-Logo'>N</span> + 🥂 = 🥳</p>
                    <button className = 'Google' onClick = {() => loginUser()}>
                    <svg width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"></path></svg>
                    <span>Accede con Google</span>
                </button>
               </div>
        
    }
      
    const posts = () => {

        let i = 0;
        let posts = [];
        let sortedKeys = [];
        let date = new Date();
                
        // Sorting object
        if(filter === 'Visitas'  && articleData) sortedKeys = Object.keys(articleData).sort( (a, b) => articleData[b].views - articleData[a].views);
        if(filter === 'Aplausos' && articleData) sortedKeys = Object.keys(articleData).sort( (a, b) => {
            
            	if (articleData[a].likes === articleData[b].likes) return 0;
                if (articleData[b].likes === undefined) return -1;
                if (articleData[a].likes === undefined) return  1;
            
                return articleData[b].likes - articleData[a].likes;
        
        }); 
        if(filter === 'Nuevo') sortedKeys = Object.keys(Data);            
                
        sortedKeys && sortedKeys.forEach( key => {
                        
            if(Data[key]){
                
                // If privat is undefined, show article to the user
                let privat = Data[key].privat ? true : false;

                // Inserting all the posts, if it's restricted and user is not logged in, we blocked it
                let article = <Link to = {'/' + key}>
                                <article key = {key + 1}>
                                    <div className = 'Title-Date-Privat'>
                                        <div className = 'Title-Date'>
                                            <div className = 'Title'>{Data[key].title}</div>
                                            <div className = 'Date'>{Data[key].date[0]} de {Data[key].date[1]} del {Data[key].date[2]}</div>
                                        </div>
                                    </div>
                                    <div className = 'Content'>
                                        <p>{Data[key].description}</p>
                                        <div className = 'Privat'>
                                            {!user && Data[key].privat && <div>🔒</div>}
                                            {user  && Data[key].privat && <div>🔓</div>}
                                        </div>
                                    </div>
                                </article>
                            </Link>;

                // Pushing article
                posts.push(article);

                // Incrementing i and inserting login box
                if(i++ === 3 && !user) posts.push(loginBox());   
            }
        });
            
        return (posts.slice(0, displayPosts));

    }
    
    return (
      <div className = 'Blog'>
            <h1>Blog</h1>
            <div style = {{textAlign: 'center'}}>El archivo contiene una colección de {Object.keys(Data).length} artículos. ☕</div>
            <div className = 'Filter-Blog'>
                <div className = {filter === 'Nuevo'      ? 'Active' : null} onClick = {() => setFilter('Nuevo')}>Nuevo</div>
                <div className = {filter === 'Visitas'    ? 'Active' : null} onClick = {() => setFilter('Visitas')}>Visitas</div>
                <div className = {filter === 'Aplausos'   ? 'Active' : null} onClick = {() => setFilter('Aplausos')}>Aplausos</div>
            </div>
            <div className = 'Block'>
                {posts()}
                {displayPosts < Object.keys(Data).length  && <div className = 'Active' onClick = {() => setDisplayPosts(displayPosts + 10)}>Ver más</div>}
            </div>
            {login && <Login hide = {() => setLogin(false)}></Login>}
      </div>
    );
}

export default Blog;
