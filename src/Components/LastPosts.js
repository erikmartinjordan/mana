import React    from 'react';
import { Link } from 'react-router-dom';
import Data     from '../Posts/_data';
import moment   from 'moment';
import 'moment/locale/es';
import '../Styles/LastPosts.css';

const LastPosts = ({items}) => {
    
    const daysSincePublished = (article) => {
        
        const day   = article.date[0];
        const month = article.date[1];
        const year  = article.date[2];
        
        const published = moment().locale('es').year(year).month(month).date(day);
        const now       = moment();
        
        return now.diff(published, 'days');
        
    }
    
    return(
        
        <div className = 'LastPosts'>
            <span className = 'Title'>Últimos artículos</span>
            {Object.keys(Data).slice(0, items).map( key => (
                <div key = {key} className = 'Info'>
                    <Link to = {'/' + key}>{Data[key].title}</Link>
                    {daysSincePublished(Data[key]) <= 7 ? <div className = 'New'>Nuevo</div> : null}
                </div>
            ))}
            <Link style = {{display: 'block', textAlign: 'center', width: '100%', marginBottom: '5px', marginTop: '20px'}} to = '/blog'>Ver más artículos</Link>
        </div>
        
    ); 
    
}

export default LastPosts;