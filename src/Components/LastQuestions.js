import React, { useEffect, useState }       from 'react';
import { Link }                             from 'react-router-dom';
import moment                               from 'moment';
import Loading                              from './Loading';
import Likes                                from './Likes';
import UserAvatar                           from './UserAvatar';
import firebase                             from '../Functions/Firebase';
import '../Styles/LastQuestions.css';

const LastQuestions = (props) => {
    
    const [loading, setLoading]             = useState(true);
    const [items, setItems]                 = useState(props.items);
    const [lastQuestions, setLastQuestions] = useState([]);
    
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
        
        Object.keys(questions).forEach(key => {
            
            questions[key].key = key;
            if(!questions[key].voteUsers) questions[key].voteUsers = {};
            if(!questions[key].replies)   questions[key].replies = {};
        
        });
        
        let sorted = Object.values(questions).sort( (a, b) => {
            
            if(orderBy === 'nuevo')        return b.timeStamp - a.timeStamp;
            if(orderBy === 'comentarios')  return Object.keys(b.replies).length   - Object.keys(a.replies).length;
            if(orderBy === 'picante')      return Object.keys(b.voteUsers).length - Object.keys(a.voteUsers).length;
            
            return null;
            
        });
        
        return sorted;
        
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
                        <div className = 'Top-Card'>
                            <h3>{question.title}</h3>
                            <Likes authorId = {question.userUid} postId = {question.key}/>
                        </div>
                        <div className = 'Bottom-Card'>
                            <div className = 'Author-Name-Date'> 
                                <UserAvatar user = {{uid: question.userUid, photoURL: question.userPhoto}}/>
                                <span className = 'Author-Date'>
                                    {question.userName}
                                    <time>{moment(question.timeStamp).fromNow()}</time>
                                </span>
                            </div>
                            <div className = 'Num-Comments'>
                                {Object.keys(question.replies).length} {Object.keys(question.replies).length === 1 ? 'comentario' : 'comentarios'}
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
            <img style = {{width: '100%'}} src = {'https://media.giphy.com/media/wHB67Zkr63UP7RWJsj/giphy.gif'} alt = {'Elon Musk smoking'}/>
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