import React, { useEffect, useState } from 'react'
import ReactMarkdown                  from 'react-markdown'
import { Link }                       from 'react-router-dom'
import moment                         from 'moment'
import remarkGfm                      from 'remark-gfm'
import remarkMath                     from 'remark-math'
import rehypeKatex                    from 'rehype-katex'
import Verified                       from './Verified'
import Loading                        from './Loading'
import Likes                          from './Likes'
import UserAvatar                     from './UserAvatar'
import EditPost                       from './EditPost'
import DeletePost                     from './DeletePost'
import CopyLink                       from './CopyLink'
import Highlight                      from './Highlight'
import EditionTime                    from './EditionTime'
import { db, onValue, ref }           from '../Functions/Firebase'
import 'katex/dist/katex.min.css'
import '../Styles/Question.css'
import 'moment/locale/es'

moment.locale('es')

const Question = ({ admin, postId, setTitle, uid }) => {

    const [question, setQuestion] = useState('')
    
    useEffect(() => {
        
        if(question){
            document.title = question.title + ' — Nomoresheet' 
            document.querySelector('meta[name="description"]').content = question.message 
        }      
        
    })
    
    useEffect(() => {
        
        let unsubscribe = onValue(ref(db, `posts/${postId}`), snapshot => { 

            setQuestion(snapshot.val() || '')
            setTitle(snapshot.val()?.title || '')
            
        })
        
        return () => unsubscribe()
        
    }, [postId, setTitle])
    
    return(
        <React.Fragment>
        { question !== ''
        ? <div className = 'Question'>
            <div className = 'Header'>
                <div className = 'Author-Name-Date'> 
                    <UserAvatar user = {{uid: question.userUid}}/>
                    <span className = 'Author-Date'>
                        <span className = 'Author-Info'>
                            <Link to = {'/@' + question.userUid}>{question.userName}</Link> 
                            <Verified   uid = {question.userUid}/>
                        </span>
                        <time>{moment(question.timeStamp).fromNow()} <EditionTime date = {question.edited}/></time>
                    </span>
                </div>
            </div>
            <div className = 'Content'>
                    <QuestionContent  message = {question.message}/>
                    <div className = 'Meta'>
                        <Likes postId = {postId} authorId = {question.userUid}/>
                        <CopyLink                 postId = {postId} authorId = {question.userUid}/>
                        <EditPost   type = 'post' postId = {postId} authorId = {question.userUid} admin = {admin} uid = {uid}/>
                        <DeletePost type = 'post' postId = {postId} authorId = {question.userUid} admin = {admin} uid = {uid}/>
                    </div>
            </div>
         </div> 
        : <Loading type = 'Question'/>
        }
        </React.Fragment>
    )
}

export default Question

const QuestionContent = ({ message }) => {
    
    const components = {
        
        p:     props => <Highlight text = {props.children}></Highlight>,
        image: props => <img src = {props.src} onError = {(e) => e.target.style.display = 'none'} alt = {'Imagen de artículo'}></img>,
        table: props => <div className = 'TableWrap'><table>{props.children}</table></div>
        
    }
    
    return (
        <ReactMarkdown
            children      = {message} 
            components    = {components}
            remarkPlugins = {[remarkMath, remarkGfm]}
            rehypePlugins = {[rehypeKatex]}
        />
    )
    
}