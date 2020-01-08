import React, { useEffect }     from 'react';
import { Link }                 from 'react-router-dom';
import buildFormatter           from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings           from 'react-timeago/lib/language-strings/es';
import TimeAgo                  from 'react-timeago';
import GetLastComments          from '../Functions/GetLastComments.js';
import UserAvatar               from '../Functions/UserAvatar.js';

const formatter = buildFormatter(spanishStrings);

const Comments = () => {
    
    const comments = GetLastComments(10);
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
        
    });
    
    return(
        <div className = 'Comments'>
            <div className = 'LastComments'>
                <span className = 'Title'>Últimos comentarios</span>
                {comments.map( (comment, key) =>
                <Link to = {'/comunidad/post/' + comment.pid} key = {key} className = 'Info'>
                    <div className = 'Info-Wrap'>
                        <UserAvatar user = {{uid: comment.userUid, photoURL: comment.userPhoto}}/>
                        <div className = 'Author-Date'>
                            <span>{comment.author}</span>
                            <span><TimeAgo formatter = {formatter} date = {comment.timeStamp}/></span>
                        </div>
                    </div>
                    <div className = 'Claps'>👏  {comment.claps}</div>
                </Link>
                )}
                <Link style = {{textAlign: 'center', width: '100%', marginTop: '20px'}} to = '/'>Ver más temas</Link>
            </div>
        </div>);
}

export default Comments;