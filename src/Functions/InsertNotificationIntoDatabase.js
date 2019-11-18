import React            from 'react';
import firebase, {auth} from './Firebase.js';

//--------------------------------------------------------------/
// This function inserts notification into database:
//
// uid => uid target (user who is going to get notified)
// type => 'reply', 'newPost', 'chili'...
// operator => 'add', 'sub'...
//
//--------------------------------------------------------------/
const nmsNotification = (uid, type, operator) => {
    
    var replyPoints = 30;
    var newPostPoints = 40;
    var chiliPoints = 50;
    var applausePoints = 60;
    
    switch(type){
        case 'reply': firebase.database().ref('notifications/' + uid).push({  
                            
                            points: replyPoints,
                            message: 'Has publicado una respuesta a una publicación.',
                            timeStamp: Date.now()
                      
                      });
                      break;
            
        case 'newPost': firebase.database().ref('notifications/' + uid).push({  
                            
                            points: newPostPoints,
                            message: 'Publicar un artículo suma puntos.',
                            timeStamp: Date.now()
                      
                        });
                      break;
            
        case 'chili': if(operator === 'add'){
                            firebase.database().ref('notifications/' + uid).push({  

                                points: chiliPoints,
                                message: '¡Ue! Te han dado picante por un artículo tuyo publicado.',
                                timeStamp: Date.now()

                            });
                      }
                      else{
                            firebase.database().ref('notifications/' + uid).push({  

                                points: -1 * chiliPoints,
                                message: '¡Ups! Te han quitado picante... No te preocupes, los puntos se recuperan.',
                                timeStamp: Date.now()

                            });
                      }
                      break;
            
        case 'applause': if(operator === 'add'){
                            firebase.database().ref('notifications/' + uid).push({  

                                points: applausePoints,
                                message: '¡Ue! Una de tus respuestas ha sido aplaudida.',
                                timeStamp: Date.now()

                            });
                      }
                      else{
                          firebase.database().ref('notifications/' + uid).push({  
                            
                            points: -1 * applausePoints,
                            message: '¡Ups! Han retirado aplausos a una de tus respuestas.',
                            timeStamp: Date.now()
                      
                        });
                      }
                      break;
        
    }
}

export default nmsNotification;