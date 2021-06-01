import firebase from './Firebase';

const updateNumberOfViews = (post, url) => {

    firebase.database().ref(`posts/${url}/views`).transaction(value => value + 1);

    firebase.database().ref(`users/${post.userUid}/numViews`).transaction(value => value + 1);
    
    if(post.replies){

        let unique = {};

        Object.values(post.replies).forEach(reply => {
            
            if(!unique[reply.userUid]){

                firebase.database().ref(`users/${reply.userUid}/numViews`).transaction(value => value + 1);
                unique[reply.userUid] = true;

            }
        
        });
    
    }

}

export default updateNumberOfViews;