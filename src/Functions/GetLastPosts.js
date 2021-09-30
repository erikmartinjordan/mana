import { useState, useEffect }                       from 'react'
import { db, get, onValue, query, ref, limitToLast } from './Firebase'

const GetLastPosts = (userUid, nPosts) => {
    
    const [posts, setPosts] = useState([])
    
    useEffect(() => { 
        
        if(userUid && nPosts){

            let unsubscribe = onValue(query(ref(db, `users/${userUid}/lastPosts`), limitToLast(nPosts)), async snapshot => {
                
                let posts = snapshot.val()
                
                if(posts){
                    
                    let postIds  = Object.keys(posts).reverse()
                    
                    let postInfo = await Promise.all(postIds.map(async postId => {

                        let title = (await get(ref(db, `posts/${postId}/title`))).val()
                        
                        return {url: postId, title: title}
                        
                    }))
                    
                    setPosts(postInfo)
                    
                }
                
            })

            return () => unsubscribe()
            
        }
        
    }, [userUid, nPosts])
    
    return posts
    
}

export default GetLastPosts