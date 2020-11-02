import React, { useEffect, useState } from 'react';
import { Link }                       from 'react-router-dom';
import Twemoji                        from './Twemoji';
import firebase                       from '../Functions/Firebase';
import { ReactComponent as ThaiFlag } from '../Assets/thailand.svg';
import '../Styles/Tags.css';

const Tags = ({numberOfTags}) => {
    
    const [tags, setTags] = useState([]);
    
    useEffect(() => {
        
        let ref = firebase.database().ref('tags').orderByChild('counter').limitToLast(numberOfTags);
        
        let listener = ref.on('value', snapshot => {
            
            if(snapshot.val()){
                
                setTags(Object.entries(snapshot.val()));
                
            }
            else{
                
                setTags([]);
                
            }
            
        });
        
        return () => ref.off('value', listener);
        
    }, [numberOfTags]);
    
    return(
        <div className = 'Tags'>
            {tags.map(([tag, {counter}], key) => (
                <Link to = {`/tag/${tag}`} className = 'Tag' key = {key}>
                    <div className = 'Icon'>
                        { 
                            {
                                'tailandia':  <ThaiFlag/>,
                                'actualidad': <Twemoji emoji = '📰'/>,
                                'tecnologia': <Twemoji emoji = '🕹️'/>,
                                'relaciones': <Twemoji emoji = '💖'/>,
                                'viajar':     <Twemoji emoji = '🧭'/>
                                
                            }[tag] || '#'
                        }
                    </div>
                    <div className = 'NameCounter'>
                        <div className = 'Name'>{tag}</div>
                        <div className = 'Counter'>{counter} {counter > 1 ? 'posts' : 'post'}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
    
}

export default Tags;