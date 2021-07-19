import firebase from './Firebase';

const updateNumberOfViews = (post, url) => {

    let unique = {};

    unique[post.userUid] = true;

    firebase.database().ref(`users/${post.userUid}/numViews`).transaction(value => value + 1);
    
    if(post.replies){

        Object.values(post.replies).forEach(reply => {
            
            if(!unique[reply.userUid]){

                unique[reply.userUid] = true;

                firebase.database().ref(`users/${reply.userUid}/numViews`).transaction(value => value + 1);
                
            }
        
        });
    
    }

    firebase.database().ref(`posts/${url}/views`).transaction(value => value + 1);

}

export default updateNumberOfViews;