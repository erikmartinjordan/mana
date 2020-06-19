import React            from 'react';
import firebase, {auth} from './Firebase.js';
import Points           from './PointsAndValues.js';

const insertNotificationAndReputation = (uid, type, operator, points, url, message) => {
    
    var replyPoints    = Points.reply;
    var newPostPoints  = Points.post;
    var chiliPoints    = Points.spicy;
    var applausePoints = Points.applause;
    var points         = points[0];
    
    switch(type){
        
        case 'reply':   
            
            firebase.database().ref('notifications/' + uid).push({  
                
                points: replyPoints,
                message: message,
                timeStamp: Date.now(),
                url: url
                
            });
            
            firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + replyPoints); 
            
            break;
            
        case 'newPost': 
            
            firebase.database().ref('notifications/' + uid).push({  
                
                points: newPostPoints,
                message: message,
                timeStamp: Date.now(),
                url: url
              
            });
            
            firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + newPostPoints);
            
            break;
            
        case 'chili':   
            
            if(operator === 'add'){
                
                firebase.database().ref('notifications/' + uid).push({  
                    
                    points: chiliPoints,
                    message: message,
                    timeStamp: Date.now(),
                    url: url
                    
                }); 
                
                firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + chiliPoints)
            }
            else{
                
                firebase.database().ref('notifications/' + uid).push({  
                    
                    points: -1 * chiliPoints,
                    message: message,
                    timeStamp: Date.now(),
                    url: url
                    
                });
                
                firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points - chiliPoints);
            } 
            
            break;
            
        case 'applause': 
            
            if(operator === 'add'){
                
                firebase.database().ref('notifications/' + uid).push({  
                    
                    points: applausePoints,
                    message: message,
                    timeStamp: Date.now(),
                    url: url
                    
                });
                
                firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + applausePoints);
            }
            else{
                
                firebase.database().ref('notifications/' + uid).push({  
                    
                    points: -1 * applausePoints,
                    message: message,
                    timeStamp: Date.now(),
                    url: url
                  
                });
                
                firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points - applausePoints);
            }
            
            break;
        
    }
}

export default insertNotificationAndReputation;