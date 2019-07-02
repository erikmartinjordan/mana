import React from 'react';
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
    
    switch(type){
        case 'reply': firebase.database().ref('notifications/' + uid).push({  
                            
                            points: replyPoints,
                            message: 'Publicar una respuesta suma puntos.'
                      
                      });
                      break;
            
        case 'newPost': firebase.database().ref('notifications/' + uid).push({  
                            
                            points: newPostPoints,
                            message: 'Publicar un artículo suma puntos.'
                      
                        });
                      break;
            
        case 'chili': if(operator === 'add'){
                            firebase.database().ref('notifications/' + uid).push({  

                                points: chiliPoints,
                                message: '¡Ue! Te han dado picante por un artículo tuyo publicado.'

                            });
                      }
                      else{
                          firebase.database().ref('notifications/' + uid).push({  
                            
                            points: -1 * chiliPoints,
                            message: '¡Ups! Te han quitado picante... No te preocupes, los puntos se recuperan en nada.'
                      
                        });
                      }
                      break;
    }
}

export default nmsNotification;