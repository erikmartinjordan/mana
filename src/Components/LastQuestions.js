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
                
                setLastQuestions(lastQuestions);
                
            }
            
        });
        
        return () => ref.off('value', listener);
        
    }, [items]);
    
    return(
        <div className = 'LastQuestions'>
            {Object.keys(lastQuestions).reverse().map( postId => (
                <div className = 'Question' key = {postId}>
                    <Link to = {`/comunidad/post/${postId}`}>
                        <h3>{lastQuestions[postId].title}</h3>
                        <div className = 'Bottom-Card'>
                            <div className = 'Author-Name-Date'> 
                            <UserAvatar user = {{uid: lastQuestions[postId].userUid, photoURL: lastQuestions[postId].userPhoto}}/>
                            <span className = 'Author-Date'>
                                {lastQuestions[postId].userName}
                                <TimeAgo formatter = {formatter} date = {lastQuestions[postId].timeStamp}/>
                            </span>
                        </div>
                            <div className = 'Meta-Post'>
                            <div className = 'Likes'>   
                                🌶️ {lastQuestions[postId].voteUsers ? Object.keys(lastQuestions[postId].voteUsers).length : 0}
                            </div>
                            <div className = 'Num-Comments'>
                                💬 {lastQuestions[postId].replies   ? Object.keys(lastQuestions[postId].replies).length   : 0}
                            </div>
                            {lastQuestions[postId].replies && Object.keys(lastQuestions[postId].replies).map(replyId =>         
                              <div key = {replyId} className = 'Multi-Pic'>
                                 <img src = {lastQuestions[postId].replies[replyId].userPhoto}></img>
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