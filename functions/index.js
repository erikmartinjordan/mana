const {getNumberOfPosts, getNumberOfReplies, getNumberOfSpicy, getNumberOfApplauses, getNumberOfViews} = require('./getUserStats');
const data                 = require('./hosting/_data.js'); 
const fs                   = require('fs');
const admin                = require('firebase-admin');
const functions            = require('firebase-functions');
const nodemailer           = require('nodemailer');
const cors                 = require('cors')({origin: true});
const moment               = require('moment');
const user                 = functions.config().gmail.user;
const pass                 = functions.config().gmail.pass;
const dest                 = functions.config().gmail.dest;
const adminIds             = functions.config().admin.ids;
// Remember to type command before deploying → firebase functions:config:set gmail.user="EMAIL"
// Remember to type command before deploying → firebase functions:config:set gmail.pass="PASS"
// Remember to type command before deploying → firebase functions:config:set gmail.dest="DEST"

admin.initializeApp();

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});


exports.sendEmailNewPost = functions.database.ref('/posts/{postId}').onCreate(async (snapshot, context) => {
    
    let post = snapshot.val();
    
    let author  = post.userName;
    let title   = post.title;
    let message = post.message
    
    const mailOptions = {
        from: 'Erik',
        to: dest,
        subject: `Nueva publicación: ${post.title} (${author})`,
        html: message
    };
    
   
    await mailTransport.sendMail(mailOptions);
    
    return null;
    
});

exports.sendEmailNewReply = functions.database.ref('/posts/{postId}/replies/{replyId}').onCreate(async (snapshot, context) => {
    
    let reply = snapshot.val();
    
    let author  = reply.userName;
    let message = reply.message;
    
    let post = (await admin.database().ref(`/posts/${context.params.postId}`).once('value')).val();
    let title = post.title;
    
    const mailOptions = {
        from: 'Erik',
        to: dest,
        subject: `Nuevo comentario en: ${title} (${author})`,
        html: message
    };
    
    await mailTransport.sendMail(mailOptions);
    
    return null;
    
});

exports.preRender = functions.https.onRequest(async (request, response) => {
    
    let error404 = true;
    
    const path = request.path ? request.path.split('/') : request.path;
    // path[0] = nomoresheet.es path[1] = blog
    // path[0] = nomoresheet.es path[1] = comunidad
    // ...
    
    let index = fs.readFileSync('./hosting/index.html').toString();
    
    const userExists = async (uid) => {
        
        let capture = await admin.database().ref(`users/${uid}`).once('value');
        
        return capture ? true : false;
    }
    
    const postExists = async (postName) => {
        
        return data[postName] ? true : false;
    }
    
    if(!path[1])                             error404 = false;
    else if(path[1].startsWith('blog'))      error404 = false; 
    else if(path[1].startsWith('comunidad')) error404 = false; 
    else if(path[1].startsWith('acerca'))    error404 = false;
    else if(path[1].startsWith('@'))         error404 = !(await userExists(path[1]));
    else if(path[1])                         error404 = !(await postExists(path[1]));
    
    error404
    ? response.status(404).send(index)
    : response.status(200).send(index);
    
});

exports.getUserStats = functions.https.onRequest(async (request, response) => {
    
    let snapshotUsers = await admin.database().ref('/users').once('value');
    let users         = snapshotUsers.val();
    
    let snapshotPosts = await admin.database().ref('/posts').once('value');
    let posts         = snapshotPosts.val();
    
    Object.keys(users).forEach(uid => {
       
        let numPosts     = getNumberOfPosts(posts, uid);
        let numReplies   = getNumberOfReplies(posts, uid);
        let numSpicy     = getNumberOfSpicy(posts, uid);
        let numApplauses = getNumberOfApplauses(posts, uid);
        let numViews     = getNumberOfViews(posts, uid);
        
        admin.database().ref(`/users/${uid}`).update({
            
            numPosts: numPosts,
            numReplies: numReplies,
            numSpicy: numSpicy,
            numApplauses: numApplauses,
            numViews: numViews
            
        });
        
    });
    
    response.send(200);
    
});

exports.incrementPosts = functions.database.ref('/posts/{postId}').onCreate(async () => {
    
    let date = moment().format('YYYYMM');
    
    admin.database().ref(`/stats/${date}/posts`).set(admin.database.ServerValue.increment(1));
    
});

exports.decrementPosts = functions.database.ref('/posts/{postId}').onDelete(async () => {
    
    let date = moment().format('YYYYMM');
    
    admin.database().ref(`/stats/${date}/posts`).set(admin.database.ServerValue.increment(-1));
    
});

exports.incrementUsers = functions.database.ref('/users/{userId}').onCreate(async () => {
    
    let date = moment().format('YYYYMM');
    
    admin.database().ref(`/stats/${date}/users`).set(admin.database.ServerValue.increment(1));
    
});

exports.decrementUsers = functions.database.ref('/users/{userId}').onDelete(async () => {
    
    let date = moment().format('YYYYMM');
    
    admin.database().ref(`/stats/${date}/users`).set(admin.database.ServerValue.increment(-1));
    
});

exports.isAdmin = functions.https.onRequest(async (request, response) => {
    
    return cors(request, response, async () => {
        
        let token = request.body.idToken;
        
        let decodedToken = await admin.auth().verifyIdToken(token);
        
        let isAdmin = (adminIds.includes(decodedToken.uid));
        
        response.status(200).json({isAdmin: isAdmin});
        
    });
    
});

exports.getReplies = functions.https.onRequest(async (request, response) => {
    
    return cors(request, response, async () => {
        
        let snapshot = await admin.database().ref('posts').once('value');
        let posts    = snapshot.val();
        
        let postsWithReplies = Object.entries(posts).forEach(([postId, {replies}]) => {
            
            if(replies){
                
                Object.entries(replies).forEach(([replyId, reply]) => {
                    
                    admin.database().ref(`replies/${replyId}`).update(reply);
                    admin.database().ref(`replies/${replyId}`).update({postId: postId});
                    
                });
                
            }
            
        });
        
        response.send(200);
        
    });
    
});

exports.getLastArticles = functions.https.onRequest(async (request, response) => {
    
    return cors(request, response, async () => {
        
        let snapshot = await admin.database().ref('posts').once('value');
        let posts    = snapshot.val();
        
        Object.entries(posts).forEach( ([postId, {userUid}]) => {
            
            admin.database().ref(`users/${userUid}/lastPosts/${postId}`).set(true);
            
        });
        
        response.send(200);
        
    });
    
}); 

exports.getUserNames = functions.https.onRequest(async (request, response) => {
    
    return cors(request, response, async () => {
        
        let snapshot = await admin.database().ref('posts').once('value');
        let posts    = snapshot.val();
        
        Object.keys(posts).forEach(id => {
            
            admin.database().ref(`users/${posts[id].userUid}`).update({name: posts[id].userName});
            
            if(typeof posts[id].replies !== 'undefined'){
                
                var replies = posts[id].replies;
                
                Object.keys(replies).forEach(id => {
                    
                    admin.database().ref(`users/${replies[id].userUid}`).update({name: replies[id].userName});
                    
                });
                
            }
            
        });
        
        response.send(200);
        
    });
    
}); 

exports.getUserProfilePics = functions.https.onRequest(async (request, response) => {
    
    return cors(request, response, async () => {
        
        let snapshot = await admin.database().ref('posts').once('value');
        let posts    = snapshot.val();
        
        Object.keys(posts).forEach(id => {
            
            admin.database().ref(`users/${posts[id].userUid}`).update({profilePic: posts[id].userPhoto});
            
            if(typeof posts[id].replies !== 'undefined'){
                
                var replies = posts[id].replies;
                
                Object.keys(replies).forEach(id => {
                    
                    admin.database().ref(`users/${replies[id].userUid}`).update({profilePic: replies[id].userPhoto});
                    
                });
                
            }
            
        });
        
        response.send(200);
        
    });
    
});