import { useState, useEffect }                       from 'react'
import { db, get, limitToLast, onValue, query, ref } from './Firebase'

const GetLastReplies = (userUid, nReplies) => {
    
    const [replies, setReplies] = useState([])
    
    useEffect(() => { 
        
        if(userUid && nReplies){
           
            onValue(query(ref(db, `users/${userUid}/lastReplies`), limitToLast(nReplies)), async snapshot => {
                
                let replies = snapshot.val()
                
                if(replies){
                    
                    let replyIds  = Object.keys(replies).reverse()
                    
                    let replyInfo = await Promise.all(replyIds.map(async replyId => {
                        
                        let postId   = replies[replyId]
                        let title = (await get(ref(db, `posts/${postId}/title`))).val()
                        
                        return {url: `${postId}/#${replyId}`, title: title}
                        
                    }))
                    
                    setReplies(replyInfo)
                    
                }
                
            })
            
        }
        
    }, [userUid, nReplies])
    
    return replies
    
}

export default GetLastReplies