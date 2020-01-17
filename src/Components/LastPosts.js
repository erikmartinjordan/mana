import React    from 'react';
import { Link } from 'react-router-dom';
import Data     from '../Posts/_data';
import '../Styles/LastPosts.css';

const LastPosts = (props) => {
    
    return(
        <div className = 'LastPosts'>
            <span className = 'Title'>Últimos artículos</span>
            {Object.keys(Data).slice(0, props.items).map( key => (
                <div key = {key} className = 'Info'>
                    <Link to = {'/' + key}>{Data[key].title}</Link>
                </div>
            ))}
            <Link style = {{display: 'block', textAlign: 'center', width: '100%', marginTop: '20px'}} to = '/blog'>Ver más artículos</Link>
        </div>
        
    ); 
    
}

export default LastPosts;