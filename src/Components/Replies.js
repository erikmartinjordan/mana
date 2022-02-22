import React, { useEffect, useState }  from 'react'
import { useRef }                      from 'react'
import ReactMarkdown                   from 'react-markdown'
import moment                          from 'moment'
import remarkGfm                       from 'remark-gfm'
import remarkMath                      from 'remark-math'
import rehypeKatex                     from 'rehype-katex'
import { Link }                        from 'react-router-dom'
import Verified                        from './Verified'
import LikesComments                   from './LikesComments'
import UserAvatar                      from './UserAvatar'
import EditPost                        from './EditPost'
import DeletePost                      from './DeletePost'
import CopyLink                        from './CopyLink'
import Highlight                       from './Highlight'
import EditionTime                     from './EditionTime'
import SortReplies                     from './SortReplies'
import 'katex/dist/katex.min.css'
import '../Styles/Replies.css'
import 'moment/locale/es'

moment.locale('es')

const Replies = ({ admin, postId, uid }) => {
    
    const [replies, setReplies] = useState([])
    const replyRef              = useRef()
    const scrollToReplyId       = window.location.href.split('#').pop()
    
    useEffect( () => {
        
        if(replyRef.current)
            replyRef.current.scrollIntoView({behavior: 'smooth', block: 'center'})
        
    })
    
    return(
        <div className = 'Replies'>
            <SortReplies 
                postId     = {postId}
                replies    = {replies} 
                setReplies = {setReplies}
            />
            {replies.map(([key, reply]) => (
                <div className = {key === scrollToReplyId ? 'Reply Flash' : 'Reply'}  key = {key} ref = {key === scrollToReplyId ? replyRef : null}>
                    <div className = 'Header'>
                        <div className = 'Author-Name-Date'> 
                            <UserAvatar user = {{uid: reply.userUid}}/>
                            <span className = 'Author-Date'>
                                <span className = 'Author-Info'>
                                    <Link to = {'/@' + reply.userUid}>{reply.userName}</Link>
                                    <Verified   uid = {reply.userUid}/>
                                </span>
                                <time>{moment(reply.timeStamp).fromNow()} <EditionTime date = {reply.edited}/></time>
                            </span>
                        </div>
                    </div> 
                    <div className = 'Content'>
                        <Reply message = {reply.message}/>
                        <div className = 'Meta'>
                            <LikesComments postId = {postId} replyId = {key} authorId = {reply.userUid}/>
                            <CopyLink                  postId = {postId} replyId = {key} authorId = {reply.userUid}/>
                            <EditPost   type = 'reply' postId = {postId} replyId = {key} authorId = {reply.userUid} admin = {admin} uid = {uid}/>
                            <DeletePost type = 'reply' postId = {postId} replyId = {key} authorId = {reply.userUid} admin = {admin} uid = {uid}/>
                        </div>
                    </div>
                </div>
            ))}
        </div> 
    )
}

export default Replies

const Reply = ({ message }) => {
    
    const components = {
        
        p:     props => <Highlight text = {props.children}></Highlight>,
        img:   props => <img src = {props.src} onError = {(e) => e.target.style.display = 'none'} alt = {'Nomoresheet imagen'}></img>,  
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