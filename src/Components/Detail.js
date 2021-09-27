import React, { useContext, useState, useEffect } from 'react'
import Question                                   from './Question'
import Replies                                    from './Replies'
import Norms                                      from './Norms'
import RelatedContent                             from './RelatedContent'
import NewReply                                   from './NewReply'
import Default                                    from './Default'
import Privileges                                 from './Privileges'
import Participants                               from './Participants'
import { db, ref, get }                           from '../Functions/Firebase'
import UserContext                                from '../Functions/UserContext'
import updateNumberOfViews                        from '../Functions/UpdateNumberOfViews'
import addRichResultSchema                        from '../Functions/AddRichResultSchema'
import '../Styles/Forum.css';

const Detail = (props) => {
    
    const [uid, setUid]             = useState(null)
    const [validPost, setValidPost] = useState(true)
    const [title, setTitle]         = useState(null)
    const url                       = props.match.params.string
    const { user, admin }           = useContext(UserContext)
    
    useEffect(() => {
        
        setUid(user?.uid || null)
        
    }, [user])
    
    useEffect(() => {
        
        const fetchPost = async () => {

            let post = (await get(ref(db, `posts/${url}`))).val()
            
            if(post){

                updateNumberOfViews(post, url)
                addRichResultSchema(post, url)

            }
            else{

                setValidPost(false)

            }
            
        }
        
        fetchPost()
    
    }, [url])
        
    return (
        <React.Fragment>
            {validPost
            ? <div className = 'Forum Detail'>
                <h1>{title}</h1>
                <div className = 'Forum-TwoCol'>
                    <div className = 'Main'>
                        <Question postId = {url} admin = {admin} uid = {uid} setTitle = {setTitle} />
                        <Replies  postId = {url} admin = {admin} uid = {uid}/>
                        <NewReply postId = {url}/>
                    </div>
                    <div className = 'Sidebar'>
                        <Norms/>
                        <Participants/>
                        <Privileges/>
                        <RelatedContent/>
                    </div>
                </div>
              </div>   
            : <Default/>
            }
        </React.Fragment> 
    )
}

export default Detail