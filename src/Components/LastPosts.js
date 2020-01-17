import React    from 'react';
import { Link } from 'react-router-dom';
import Data     from '../Posts/_data';

const LastPosts = (props) => {
    
    return(
        Object.keys(Data).slice(0, props.items).map( key => (
            <div key = {key} className = 'Info'>
                <div className = 'Bullet'></div>  
                <Link to = {'/' + key}>{Data[key].title}</Link>
            </div>
        ))
    ); 
    
}

export default LastPosts;