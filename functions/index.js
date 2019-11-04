const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const user = functions.config().gmail.user;
const pass = functions.config().gmail.pass;
const dest = functions.config().gmail.dest;
// Remember to type command before deploying → firebase functions:config:set gmail.user="EMAIL"
// Remember to type command before deploying → firebase functions:config:set gmail.pass="PASS"
// Remember to type command before deploying → firebase functions:config:set gmail.dest="DEST"

// Creating transport
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

// Sends email in case of DB change
exports.sendEmail = functions.database.ref('/posts/{postId}/{label}').onWrite( async (change, context) => {
    
    // The reference where the change took place
    const ref = change.after.ref;
    
    // Reference of the postId
    const refPostId = ref.parent;
    
    // Getting the data of the post Id
    const snapshot =  await refPostId.once('value');
    
    // Getting the name of the message
    const message = snapshot.val().message;
    
    // Defining subject and text
    const subject = context.params.label === 'message' ? 'Nuevo post' : 'Nuevo comentario';
    const text    = context.params.label === 'message' ? `Nuevo post: ${message}.` : `Nuevo comentario en: ${message}`;
    
    // Defining mail options
    const mailOptions = {
        from: 'Erik',
        to: dest,
        subject: subject,
        text: text
    };
    
    // Only sending mail if new message or reply
    if(context.params.label === 'message' || context.params.label === 'replies') 
        await mailTransport.sendMail(mailOptions);
    
    return null;
    
});
