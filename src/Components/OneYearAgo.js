import React, { useEffect, useState }                     from 'react'
import { Link }                                                         from 'react-router-dom'
import moment                                                           from 'moment'
import Loading                                                          from './Loading'
import { db, limitToFirst, onValue, orderByChild, query, ref, startAt } from '../Functions/Firebase'
import '../Styles/OneYearAgo.css'

const OneYearAgo = () => {
    
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
        
        let lastYearStartOfWeek = moment().subtract(1, 'year').startOf('week').valueOf()
        
        let unsubscribe = onValue(query(ref(db, 'posts'), orderByChild('timeStamp'), startAt(lastYearStartOfWeek), limitToFirst(5)), snapshot => {
           

            setPosts(snapshot.val() || {})
            
        })
        
        return () => unsubscribe()
        
    }, [])
    
    return Object.entries(posts).length > 0
    ? <div className = 'OneYearAgo'>
            <span className = 'Title'>Hace un año...</span>
            <div className = 'Articles'>
                { Object.entries(posts).map(([url, {title, replies = {}, votes, views}]) => (
                    <div className = 'Article' key = {url}>
                        <Link to = {`/comunidad/post/${url}`}>{title}</Link>    
                        <p>{Object.keys(replies).length} {Object.keys(replies).length === 1 ? 'respuesta' : 'respuestas'}</p>
                    </div>
                ))}
            </div>
        </div>
    : <Loading type = 'OneYearAgo'/>    
    
}

export default OneYearAgo