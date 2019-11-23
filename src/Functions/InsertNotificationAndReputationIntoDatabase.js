import React            from 'react';
import firebase, {auth} from './Firebase.js';
import Points           from './PointsAndValues.js';

//--------------------------------------------------------------/
// This function inserts notification into database:
//
// uid => uid target (user who is going to get notified)
// type => 'reply', 'newPost', 'chili'...
// operator => 'add', 'sub'...
//
// And it inserts reputation points of the user as well
//
//--------------------------------------------------------------/
const insertNotificationAndReputation = (uid, type, operator, points) => {
    
    var replyPoints    = Points.reply;
    var newPostPoints  = Points.post;
    var chiliPoints    = Points.spicy;
    var applausePoints = Points.applause;
    var points         = points[0];
    
    switch(type){
            
        case 'reply':   
            
            firebase.database().ref('notifications/' + uid).push({  
                            
                points: replyPoints,
                message: 'Has publicado una respuesta a una publicación.',
                timeStamp: Date.now()
            });
            
            firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + replyPoints); 
            
            break;
            
        case 'newPost': 
            
            firebase.database().ref('notifications/' + uid).push({  
                
                points: newPostPoints,
                message: 'Publicar un artículo suma puntos.',
                timeStamp: Date.now()
              
            });
            
            firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + newPostPoints);
            
            break;
            
        case 'chili':   
            
            if(operator === 'add'){
                
                firebase.database().ref('notifications/' + uid).push({  
                    
                    points: chiliPoints,
                    message: '¡Ue! Te han dado picante por un artículo tuyo publicado.',
                    timeStamp: Date.now()
                    
                }); 
                
                firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + chiliPoints)
            }
            else{
                
                firebase.database().ref('notifications/' + uid).push({  
                    
                    points: -1 * chiliPoints,
                    message: '¡Ups! Te han quitado picante... No te preocupes, los puntos se recuperan.',
                    timeStamp: Date.now()
                    
                });
                
                firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points - chiliPoints);
            } 
            
            break;
            
        case 'applause': 
            
            if(operator === 'add'){
                
                firebase.database().ref('notifications/' + uid).push({  
                    
                    points: applausePoints,
                    message: '¡Ue! Una de tus respuestas ha sido aplaudida.',
                    timeStamp: Date.now()
                    
                });
                
                firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points + applausePoints);
            }
            else{
                
                firebase.database().ref('notifications/' + uid).push({  
                    
                    points: -1 * applausePoints,
                    message: '¡Ups! Han retirado aplausos a una de tus respuestas.',
                    timeStamp: Date.now()
                      
                });
                
                firebase.database().ref('users/' + uid + '/reputationData/' + Date.now()).transaction(value => points - applausePoints);
            }
            
            break;
        
    }
}

export default insertNotificationAndReputation;