import React, { useEffect, useState }       from 'react';
import { Link }                             from 'react-router-dom';
import buildFormatter                       from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                       from 'react-timeago/lib/language-strings/es';
import TimeAgo                              from 'react-timeago';
import Loading                              from './Loading.js';
import UserAvatar                           from '../Functions/UserAvatar';
import firebase                             from '../Functions/Firebase';
import { HeartIcon, CommentDiscussionIcon } from '@primer/octicons-react'
import '../Styles/LastQuestions.css';

const formatter = buildFormatter(spanishStrings);

const LastQuestions = (props) => {
    
    const [loading, setLoading]             = useState(true);
    const [items, setItems]                 = useState(props.items);
    const [lastQuestions, setLastQuestions] = useState([]);
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });
    
    useEffect( () => {
        
        let ref = props.tag 
        ? firebase.database().ref('posts/').orderByChild(`tags/${props.tag}`).equalTo(true).limitToLast(items)
        : firebase.database().ref('posts/').limitToLast(items);
        
        let listener = ref.on('value', snapshot => {
            
            if(snapshot.val()){
                
                let lastQuestions = snapshot.val();
                
                let sortedQuestions = sortQuestions(lastQuestions, props.timeline);
                
                setLastQuestions(sortedQuestions);
                
            }
            else{
                
                setLastQuestions([]);
                
            }
            
            setLoading(false);
            
        });
        
        return () => ref.off('value', listener);
        
    }, [items, props.timeline, props.tag]);
    
    const sortQuestions = (questions, orderBy) => {
        
        Object.keys(questions).map(key => {
            
            questions[key].key = key;
            if(!questions[key].voteUsers) questions[key].voteUsers = {};
            if(!questions[key].replies)   questions[key].replies = {};
        
        });
        
        let sorted = Object.values(questions).sort( (a, b) => {
            
            if(orderBy === 'nuevo')        return b.timeStamp - a.timeStamp;
            if(orderBy === 'comentarios')  return Object.keys(b.replies).length   - Object.keys(a.replies).length;
            if(orderBy === 'picante')      return Object.keys(b.voteUsers).length - Object.keys(a.voteUsers).length;
            
        });
        
        return sorted;
        
    }
    
    const uniquePics = (question) => {
        
        if(question.replies){
            
            var imgArray = Object.keys(question.replies).map(key => question.replies[key].userPhoto);         
            
        }
        
        let unique = [...new Set(imgArray)].map( (elem, key) => <img key = {key} src = {elem}></img>);
        
        return unique;
        
    }
    
    return(
        <React.Fragment>
        { loading
        ? <Loading type = 'Responses'/> 
        : lastQuestions.length > 0 
        ? <div className = 'LastQuestions'>
            {lastQuestions.map(question => (
                <div className = 'Question' key = {question.key}>
                    <Link to = {`/comunidad/post/${question.key}`}>
                        <h3>{question.title}</h3>
                        <div className = 'Bottom-Card'>
                            <div className = 'Author-Name-Date'> 
                            <UserAvatar user = {{uid: question.userUid, photoURL: question.userPhoto}}/>
                            <span className = 'Author-Date'>
                                {question.userName}
                                <TimeAgo formatter = {formatter} date = {question.timeStamp}/>
                            </span>
                        </div>
                            <div className = 'Meta-Post'>
                            <div className = 'Multi-Pic'>
                                {uniquePics(question)}
                            </div>
                            <div className = 'Num-Comments'>
                                { Object.keys(question.replies).length === 0 
                                ? ``
                                : Object.keys(question.replies).length === 1
                                ? `1 comentario`
                                : `${Object.keys(question.replies).length} comentarios`}
                            </div>
                        </div>
                        </div>
                    </Link>
                </div>
            ))}
            { lastQuestions.length === items
            ? <button onClick = {() => setItems(prev => prev + 10)} className = 'bottom'>Mostrar más</button> 
            : null
            }
          </div>
        : <div>
            <img style = {{width: '100%'}} src = {'https://media.giphy.com/media/wHB67Zkr63UP7RWJsj/giphy.gif'}/>
            <p>No hay publicaciones en esta categoría...</p>
            <ul>
                <li>Puedes comentar a través del foro haciendo clic <Link to = '/'>aquí</Link>.</li>
                <li>O puedes ver el archivo de entradas haciendo clic <Link to = '/blog'>aquí</Link>.</li>
                <li>O puedes quedarte viendo a Elon Musk.</li>
            </ul>
          </div>
        }
        </React.Fragment>
    ); 
    
}

export default LastQuestions;