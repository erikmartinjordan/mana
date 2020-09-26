const {getNumberOfPosts, getNumberOfReplies, getNumberOfSpicy, getNumberOfApplauses, getNumberOfViews} = require('./getUserStats');
const data                 = require('./hosting/_data.js'); 
const fs                   = require('fs');
const admin                = require('firebase-admin');
const functions            = require('firebase-functions');
const nodemailer           = require('nodemailer');
const cors                 = require('cors')({origin: true});
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


exports.sendEmail = functions.database.ref('/posts/{postId}/{label}').onWrite( async (change, context) => {
    
    const ref = change.after.ref;
    
    const refPostId = ref.parent;
    
    const snapshot =  await refPostId.once('value');
    
    const message = snapshot.val().message;
    
    const subject = context.params.label === 'message' ? 'Nuevo post' : 'Nuevo comentario';
    const text    = context.params.label === 'message' ? `Nuevo post: ${message}.` : `Nuevo comentario en: ${message}`;
    
    const mailOptions = {
        from: 'Erik',
        to: dest,
        subject: subject,
        text: text
    };
    
    if(context.params.label === 'message' || context.params.label === 'replies') 
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
    
})

exports.getStats  = functions.https.onRequest(async (request, response) => {
    
    let today     = new Date();
    
    let year      = today.getFullYear();
    let month     = ('0' + (today.getMonth() + 1)).slice(-2);
    
    let snapshot  = await admin.database().ref().once('value');
    let json      = snapshot.val();
    
    let posts     = Object.keys(json.posts).length;
    let articles  = Object.keys(json.articles).length;
    let users     = Object.keys(json.users).length;
    
    admin.database().ref(`/stats/${year}${month}`).set({
        
        posts: posts,
        articles: articles,
        users: users,
        
    });
    
    response.send(200);
    
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
        
        let postsWithReplies = Object.entries(posts).forEach( ([postId, {replies}]) => {
            
            if(replies){
                
                admin.database().ref(`replies`).update(replies);
                
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