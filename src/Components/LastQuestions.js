import React, { useEffect, useState }                                                  from 'react'
import { Link }                                                                        from 'react-router-dom'
import { ArrowDownIcon }                                                               from '@primer/octicons-react'
import moment                                                                          from 'moment'
import Loading                                                                         from './Loading'
import Likes                                                                           from './Likes'
import UserAvatar                                                                      from './UserAvatar'
import { db, endAt, equalTo, limitToLast, onValue, orderByChild, query, ref, startAt } from '../Functions/Firebase'
import '../Styles/LastQuestions.css'
import 'moment/locale/es'

moment.locale('es')

const LastQuestions = ({ number, from, to, filter }) => {
    
    const [loading, setLoading]             = useState(true)
    const [items, setItems]                 = useState(number)
    const [lastQuestions, setLastQuestions] = useState([])
    const tag                               = window.location.pathname.split('/').pop()
    
    useEffect(() => {
        
        if(tag){

            var _query = query(ref(db, 'posts'), orderByChild(`tags/${tag}`), equalTo(true), limitToLast(items))

        }
        else if(from && to){

            var _query = query(ref(db, 'posts'), orderByChild('timeStamp'), startAt(from), endAt(to))

        }
        else{

            var _query = query(ref(db, 'posts'), limitToLast(items))

        }
        
        let unsubscribe = onValue(_query, snapshot => {
            
            let lastQuestions = snapshot.val() || {}
                
            let sortedQuestions = sortQuestions(lastQuestions, filter)
                
            setLastQuestions(sortedQuestions)
            
            setLoading(false)
            
        })
        
        return () => unsubscribe()
        
    }, [filter, items, number, from, to])
    
    const sortQuestions = (questions, orderBy) => {
        
        Object.keys(questions).forEach(key => {
            
            questions[key].key = key
            if(!questions[key].voteUsers) questions[key].voteUsers = {}
            if(!questions[key].replies)   questions[key].replies = {}
        
        })
        
        let sorted = Object.values(questions).sort((a, b) => {
            
            if(orderBy === 'nuevo')      return b.timeStamp - a.timeStamp
            if(orderBy === 'respuestas') return Object.keys(b.replies).length   - Object.keys(a.replies).length
            if(orderBy === 'puntos')     return Object.keys(b.voteUsers).length - Object.keys(a.voteUsers).length
            
            return null
            
        })
        
        return sorted
        
    }
    
    return(
        <React.Fragment>
        { loading
        ? <Loading type = 'Responses'/> 
        : lastQuestions.length > 0 
        ? <div className = 'LastQuestions'>
            { lastQuestions.map(question => (
                <div className = 'Question' key = {question.key}>
                    <Likes authorId = {question.userUid} postId = {question.key}/>
                    <div className = 'Title-Author'> 
                        <Link to = {`/p/${question.key}`} className = 'Title'>{question.title}</Link>
                        <div className = 'Author-Date-Responses'>
                            <UserAvatar user = {{uid: question.userUid}}/>
                            <div className = 'Author-Date'>
                                <Link to = {`/@${question.userUid}`}  className = 'Author'>{question.userName}</Link>
                                <div className = 'Date-Responses'>
                                    <time>{moment(question.timeStamp).fromNow()}</time>, {Object.keys(question.replies).length} {Object.keys(question.replies).length === 1 ? 'respuesta' : 'respuestas'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            { lastQuestions.length === items
            ? <button onClick = {() => setItems(prev => prev + 10)} className = 'more'>Mostrar más<ArrowDownIcon/></button> 
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
    ) 
    
}

export default LastQuestions