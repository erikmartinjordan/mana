import { db, ref, runTransaction } from './Firebase'

const updateNumberOfViews = (post, url) => {

    let unique = {}

    unique[post.userUid] = true

    runTransaction(ref(db, `users/${post.userUid}/numViews`), value => value + 1)
    
    if(post.replies){

        Object.values(post.replies).forEach(reply => {
            
            if(!unique[reply.userUid]){

                unique[reply.userUid] = true

                runTransaction(ref(db, `users/${reply.userUid}/numViews`), value => value + 1)
                
            }
        
        })
    
    }

    runTransaction(ref(db, `posts/${url}/views`), value => value + 1)

}

export default updateNumberOfViews