import React, { useState, useEffect } from 'react';
import moment                         from 'moment';
import Twemoji                        from './Twemoji';
import firebase, { auth }             from '../Functions/Firebase';
import Data                           from '../Posts/_data';
import { Link }                       from 'react-router-dom';
import '../Styles/Blog.css';
import 'moment/locale/es';

const Blog = () => {

    const [displayPosts, setDisplayPosts] = useState(10);
    const [sortedPosts, setSortedPosts]   = useState([]);
    const [user, setUser]                 = useState(null);
    const timeLimitPrivateArticleInMonths = 2;
    
    useEffect( () => {
        
        document.title = 'Blog - Nomoresheet'; 
        document.querySelector(`meta[name = 'description']`).content = 'Artículos de Nomoresheet.'; 
        
    })
    
    useEffect( () => {
        
        auth.onAuthStateChanged( user => { 
            
            if(user) 
                setUser(user);
            else
                setUser(null);
            
        });
        
    }, []);
    
    return (
        <div className = 'Blog'>
            <h1>Blog</h1>
            <div style = {{textAlign: 'center'}}>El archivo contiene una colección de {Object.keys(Data).length} artículos. ☕</div>
            <Filter 
                setSortedPosts = {setSortedPosts}
                />
            <Posts  
                sortedPosts = {sortedPosts} 
                displayPosts = {displayPosts}
                timeLimitPrivateArticleInMonths = {timeLimitPrivateArticleInMonths}
                user = {user}
            />
            <ShowMorePosts 
                displayPosts = {displayPosts} 
                setDisplayPosts = {setDisplayPosts}
            />
        </div>
    );
}

export default Blog;

const Filter = ({setSortedPosts}) => {
    
    const [articleData, setArticleData] = useState([]);
    const [filter, setFilter]           = useState('Nuevo');
    
    useEffect( () => {
        
        let ref = firebase.database().ref('articles');
        
        let listener = ref.on('value', snapshot => {
            
            let articleData = snapshot.val();
            
            if(articleData) 
                setArticleData(articleData);
            
        });
        
        return () => ref.off('value', listener);
        
    }, []);
    
    useEffect( () => {
        
        let sortedKeys;
        
        if(filter === 'Visitas'){ 
            
            sortedKeys = Object.keys(articleData).sort( (a, b) => articleData[b].views - articleData[a].views);
            
        }
        if(filter === 'Aplausos'){
            
            sortedKeys = Object.keys(articleData).sort( (a, b) => {
            
            	if (articleData[a].likes === articleData[b].likes) return 0;
                if (articleData[b].likes === undefined) return -1;
                if (articleData[a].likes === undefined) return  1;
            
                return articleData[b].likes - articleData[a].likes;
        
            }); 
            
        }
        if(filter === 'Nuevo'){
            
            sortedKeys = Object.keys(Data); 
        }
        
        setSortedPosts(sortedKeys);
        
    }, [articleData, setSortedPosts, filter]);
    
    return(
        <div className = 'Filter-Blog'>
            <div className = {filter === 'Nuevo'    ? 'Active' : null} onClick = {() => setFilter('Nuevo')}>Nuevo</div>
            <div className = {filter === 'Visitas'  ? 'Active' : null} onClick = {() => setFilter('Visitas')}>Visitas</div>
            <div className = {filter === 'Aplausos' ? 'Active' : null} onClick = {() => setFilter('Aplausos')}>Aplausos</div>
        </div>
    );
    
}

const Posts = ({sortedPosts, displayPosts, timeLimitPrivateArticleInMonths, user}) => {
    
    const isPrivat = (key) => {
        
        let privat;
        
        let [day, month, year] = [Data[key].date[0], Data[key].date[1], Data[key].date[2]];
        
        let fullDate = moment().locale('es').year(year).month(month).date(day).format('YYYYMMDD');
        let today    = moment();
        
        let monthsSincePostWasPublished = today.diff(fullDate, 'months');
        
        if('privat' in Data[key]){
            privat = Data[key].privat;
        }
        else if(monthsSincePostWasPublished < timeLimitPrivateArticleInMonths){
            privat = true;
        }
        
        return privat;
        
    }
    
    return(
        <div className = 'Block'>
            {sortedPosts.slice(0, displayPosts).map(key =>
                <Link to = {'/' + key} key = {key + 1}>
                    <article >
                        <div className = 'Title-Date-Privat'>
                            <div className = 'Title-Date'>
                                <div className = 'Title'>{Data[key].title}</div>
                                <div className = 'Date'>{Data[key].date[0]} de {Data[key].date[1]} del {Data[key].date[2]}</div>
                            </div>
                        </div>
                        <div className = 'Content'>
                            <p>{Data[key].description}</p>
                            <div className = 'Privat'>
                                {isPrivat(key) && !user ? <Twemoji emoji = {'🔒'}/>  : null}
                                {isPrivat(key) && user  ? <Twemoji emoji = {'🔓'}/> : null}
                            </div>
                        </div>
                    </article>
                </Link>
            )}
        </div>
    );
    
}

const ShowMorePosts = ({displayPosts, setDisplayPosts}) => {
    
    return(
        <div className = 'Block'>
            {displayPosts < Object.keys(Data).length
            ? <div className = 'Active' onClick = {() => setDisplayPosts(displayPosts + 10)}>Ver más</div>
            : null}
        </div>
    );
    
}