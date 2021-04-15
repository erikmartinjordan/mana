import firebase from './Firebase';
import Points   from './PointsAndValues';

const insertNotificationAndReputation = (uid, type, operator, points, url, message, postId, replyId) => {
    
    if(operator === 'add'){
        
        firebase.database().ref('notifications/' + uid).push({  
            
            points: Points[type],
            message: message,
            timeStamp: Date.now(),
            url: url,
            postId: postId,
            replyId: replyId
            
        });
        
        firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + Points[type]);
        firebase.database().ref('users/' + uid + '/numPoints'                   ).transaction(value => points + Points[type]);
        
    }
    
    if(operator === 'sub'){
        
        firebase.database().ref('notifications/' + uid).push({  
            
            points: -1 * Points[type],
            message: message,
            timeStamp: Date.now(),
            url: url,
            postId: postId,
            replyId: replyId
            
        });
        
        firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points - Points[type]);
        firebase.database().ref('users/' + uid + '/numPoints'                   ).transaction(value => points - Points[type]);
        
    }
    
}

export default insertNotificationAndReputation;