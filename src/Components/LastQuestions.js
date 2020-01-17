import React, { useEffect, useState } from 'react';
import { Link }                       from 'react-router-dom';
import buildFormatter                 from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                 from 'react-timeago/lib/language-strings/es';
import TimeAgo                        from 'react-timeago';
import UserAvatar                     from '../Functions/UserAvatar';
import firebase                       from '../Functions/Firebase';
import '../Styles/LastQuestions.css';

const formatter = buildFormatter(spanishStrings);

const LastQuestions = (props) => {
    
    const [items, setItems] = useState(props.items);
    const [lastQuestions, setLastQuestions] = useState([]);
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });
    
    useEffect( () => {
        
        let ref = firebase.database().ref('posts/').limitToLast(items);
        
        let listener = ref.on('value', snapshot => { 
            
            if(snapshot){
                
                let lastQuestions = snapshot.val();
                
                let sortedQuestions = sortQuestions(lastQuestions, props.timeline);
                
                setLastQuestions(sortedQuestions);
                
            }
            
        });
        
        return () => ref.off('value', listener);
        
    }, [items, props.timeline]);
    
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
    
    return(
        <div className = 'LastQuestions'>
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
                            <div className = 'Likes'>   
                                🌶️ {question.voteUsers ? Object.keys(question.voteUsers).length : 0}
                            </div>
                            <div className = 'Num-Comments'>
                                💬 {question.replies   ? Object.keys(question.replies).length   : 0}
                            </div>
                            {question.replies && Object.keys(question.replies).map(key =>         
                              <div key = {key} className = 'Multi-Pic'>
                                 <img src = {question.replies[key].userPhoto}></img>
                              </div>
                            )}
                        </div>
                        </div>
                    </Link>
                </div>
            ))}
            <button onClick = {() => setItems(prev => prev + 10)} className = 'bottom'>Mostrar más</button>
        </div>
    ); 
    
}

export default LastQuestions;