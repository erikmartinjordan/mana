import { db, push, ref, runTransaction } from './Firebase'
import Points                            from './PointsAndValues'

const insertNotificationAndReputation = (uid, type, operator, points, url, message, postId, replyId) => {
    
    if(operator === 'add'){
        
        push(ref(db, 'notifications/' + uid), {  
            
            points: Points[type],
            message: message,
            timeStamp: Date.now(),
            url: url,
            postId: postId,
            replyId: replyId,
            read: type === 'post' || type === 'reply'
            
        })
        
        runTransaction(ref(db, 'users/' + uid + '/reputationData/' + Date.now()), _ => points + Points[type])
        runTransaction(ref(db, 'users/' + uid + '/numPoints'                   ), _ => points + Points[type])
        
    }
    
    if(operator === 'sub'){
        
        push(ref(db, 'notifications/' + uid), {  
            
            points: -1 * Points[type],
            message: message,
            timeStamp: Date.now(),
            url: url,
            postId: postId,
            replyId: replyId,
            read: type === 'post' || type === 'reply'
            
        })
        
        runTransaction(ref(db, 'users/' + uid + '/reputationData/' + Date.now()), _ => points - Points[type])
        runTransaction(ref(db, 'users/' + uid + '/numPoints'                   ), _ => points - Points[type])
        
    }
    
}

export default insertNotificationAndReputation