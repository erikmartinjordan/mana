import React, { useEffect, useState }                        from 'react'
import { Link }                                              from 'react-router-dom'
import Twemoji                                               from './Twemoji'
import { db, limitToLast, onValue, query, ref, orderByChild} from '../Functions/Firebase'
import { ReactComponent as ThaiFlag }                        from '../Assets/thailand.svg'
import '../Styles/Tags.css'

const Tags = ({numberOfTags = 10}) => {
    
    const [tags, setTags] = useState([])
    
    useEffect(() => {
        
        let unsubscribe = onValue(query(ref(db, 'tags'), orderByChild('counter'), limitToLast(numberOfTags)), snapshot => {
            
            if(snapshot.val()){
                
                let sorted = Object.entries(snapshot.val()).sort((a, b) => b[1].counter  - a[1].counter)
                
                setTags(sorted)
                
            }
            else{
                
                setTags([])
                
            }
            
        })
        
        return () => unsubscribe()
        
    }, [numberOfTags])
    
    return(
        <div className = 'Tags'>
            <h2>¿De qué se habla aquí?</h2>
            <p>Los diez <em>tags</em> más utilizados:</p>
            {tags.map(([tag, {counter}], key) => (
                <Link to = {`/tag/${tag}`} className = 'Tag' key = {key}>
                    <div className = 'Icon'>#</div>
                    <div className = 'NameCounter'>
                        <div className = 'Name'>{tag}</div>
                        <div className = 'Counter'>{counter} {counter > 1 ? 'posts' : 'post'}</div>
                    </div>
                </Link>
            ))}
        </div>
    )
    
}

export default Tags