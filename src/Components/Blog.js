import React, { useState, useEffect } from 'react';
import firebase, {auth} from '../Functions/Firebase.js';
import Data from '../Posts/_data.js';
import { Link } from 'react-router-dom';
import Login from './Login.js';
import '../Styles/Blog.css';

const Blog = () => {

    const [archive, setArchive] = useState([]);
    const [articleData, setArticleData] = useState(null);
    const [abstract, setAbstract] = useState(null);
    const [filter, setFilter] = useState('Todos');
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
      
    const posts = () => {

        let posts = [];
        let date = new Date();

         for (let key in Data) {

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
                                    <div className = 'Meta'>
                                        <div className = 'Views'>👀 {articleData && articleData[key].views}</div>
                                        <div className = 'Likes'>👏 {articleData && articleData[key].likes}</div>
                                        <div className = 'SuperLikes'>🎉 {articleData && articleData[key].superlikes}</div>
                                    </div>
                                </div>
                                <div className = 'Content'>
                                    <p>{Data[key].description}</p>
                                    <div className = 'Privat'>{Data[key].privat && <div>🔒</div>}</div>
                                </div>
                            </article>
                        </Link>;
            if(filter === 'Todos') posts.push(article);             
            if(filter === 'Relevancia' && articleData[key].views && articleData[key].views > 1000)  posts.push(article); 
            if(filter === 'Nuevo' && Data[key].date[2] === date.getFullYear()) posts.push(article); 
        }

        return (posts);

    }
    
    return (
      <div className = 'Blog'>
            <h2>Blog</h2>
            <div style = {{textAlign: 'center'}}>El archivo contiene una colección de {Object.keys(Data).length} artículos. ☕</div>
            <div className = 'Filter-Blog'>
                <div className = {filter === 'Todos'      ? 'Active' : null} onClick = {() => setFilter('Todos')}>Todos 📋 </div>
                <div className = {filter === 'Relevancia' ? 'Active' : null} onClick = {() => setFilter('Relevancia')}>Relevancia ✨</div>
                <div className = {filter === 'Nuevo'      ? 'Active' : null} onClick = {() => setFilter('Nuevo')}>Nuevo 🔥</div>
            </div>
            <div className = 'Block'>
                {posts()}
            </div>
            {login && <Login hide = {() => setLogin(false)}></Login>}
      </div>
    );
}

export default Blog;
