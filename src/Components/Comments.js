import React                    from 'react'
import { Link }                 from 'react-router-dom'
import moment                   from 'moment'
import Loading                  from './Loading'
import UserAvatar               from './UserAvatar'
import GetLastComments          from '../Functions/GetLastComments'
import '../Styles/Comments.css'

const Comments = () => {
    
    const comments = GetLastComments(10)
    
    return(
        <React.Fragment>
        { comments.length !== 0
        ? <div className = 'Comments'>
            <span className = 'Title'>Últimos comentarios</span>
            <div className = 'LastComments'>
                {comments.map(([replyId, comment], key) =>
                <Link to = {`/comunidad/post/${comment.postId}/#${replyId}`} key = {key} className = 'Info'>
                    <div className = 'Info-Wrap'>
                        <UserAvatar user = {{uid: comment.userUid, photoURL: comment.userPhoto}}/>
                        <div className = 'Author-Date'>
                            <span>{comment.userName}</span>
                            <time>{moment(comment.timeStamp).fromNow()}</time>
                        </div>
                    </div>
                </Link>
                )}
            </div>
        </div>
        : <Loading type = 'Comments'/>
        }
        </React.Fragment>
    )
}

export default Comments