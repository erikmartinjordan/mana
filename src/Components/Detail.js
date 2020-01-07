import React, { useState, useEffect }  from 'react';
import { Link }                        from 'react-router-dom';
import buildFormatter                  from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings                  from 'react-timeago/lib/language-strings/es';
import TimeAgo                         from 'react-timeago';
import Linkify                         from 'react-linkify';
import PublicInfo                      from './PublicInfo.js';
import Login                           from './Login.js';
import firebase, {auth}                from '../Functions/Firebase.js';
import Likes                           from '../Functions/Likes.js';
import LikesComments                   from '../Functions/LikesComments.js';
import EmojiTextarea                   from '../Functions/EmojiTextarea';
import EditPost                        from '../Functions/EditPost';
import DeletePost                      from '../Functions/DeletePost';
import insertNotificationAndReputation from '../Functions/InsertNotificationAndReputationIntoDatabase.js';
import useVerifiedTag                  from '../Functions/VerifiedTag.js';
import Alert                           from '../Functions/Alert.js';
import GetLastComments                 from '../Functions/GetLastComments.js';
import getPremiumUsers                 from '../Functions/GetPremiumUsers.js';
import GetPoints                       from '../Functions/GetPoints.js';
import Loading                         from '../Functions/Loading.js';
import UserAvatar                      from '../Functions/UserAvatar.js';
import Accounts                        from '../Rules/Accounts.js';

const formatter = buildFormatter(spanishStrings);

const Detail = (props) => {
        
    const [admin, setAdmin]         = useState(false);
    const [alert, setAlert]         = useState(null);
    const [avatar, setAvatar]       = useState(null);
    const [chat, setChat]           = useState(null);
    const [editPost, setEditPost]   = useState(null);
    const [empty, setEmpty]         = useState(true);
    const [login, setLogin]         = useState(false);
    const [maxLength, setMaxLength] = useState(null);
    const [message, setMessage]     = useState("");
    const [nickName, setnickName]   = useState(null);
    const [ready, setReady]         = useState(false);
    const [render, setRender]       = useState(false);
    const [reply, setReply]         = useState("");
    const [send, setSend]           = useState(false);
    const [timeLimit, setTimeLimit] = useState(null);
    const [timeStamp, setTimeStamp] = useState(null);
    const [title, setTitle]         = useState("");
    const [user, setUser]           = useState("");
    const [userName, setUserName]   = useState("");
    const [userPhoto, setUserPhoto] = useState("");
    const [userUid, setUserUid]     = useState(true);
    const [views, setViews]         = useState("");
    const verified                  = useVerifiedTag();
    
    // To get the points of the user, first we need to check out if he/she is using a nickname
    // In this case, getting the points of the user with nickname 
    const points  = GetPoints(nickName ? nickName : user ? user.uid : null);
    
    // Getting last comments of the users
    const comments = GetLastComments();
    
    // Title, metadescription and loading emojis in svg will rereder always
    useEffect ( () => {
        
         // Setting title and metadescription
        if(title)    document.title = title + ' - Nomoresheet'; 
        if(message)  document.querySelector('meta[name="description"]').content = message; 

        // Loading emojis in svg
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );      
                
    });
    
    // Getting data will only get called one time
    useEffect ( () => {
        
        // Component is mounted
        let mounted = true;

        // Setting user and admin
        auth.onAuthStateChanged( (user) => {

            if(user){
                
                // Checking admin
                let admin = (user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2') ? true : false;
                
                if(mounted){
                    setAdmin(admin);
                    setUser(user);
                }
                  
                // Is user anonymous?
                firebase.database().ref('users/' + user.uid).on( 'value', snapshot => {

                    // If the user is anonymous, set the nickname and avatar
                    var anonimo = snapshot.val() && snapshot.val().anonimo ? snapshot.val().anonimo : false;

                    if(anonimo && mounted){
                        setnickName(snapshot.val().nickName);
                        setAvatar(snapshot.val().avatar);
                    }
                    
                    if(!anonimo && mounted){
                        setnickName(null);
                        setAvatar(null);
                    }

                    // Selecting timespan between messages and max Length depending on type of account
                    var typeOfAccount = snapshot.val() && snapshot.val().account ? snapshot.val().account : 'free';

                    if(mounted){
                        
                        setEditPost(Accounts[typeOfAccount].edit);
                        setMaxLength(Accounts[typeOfAccount].messages.maxLength);
                        setTimeLimit(Accounts[typeOfAccount].messages.timeSpanReplies);
                        
                    }
                    
                });
            
            }
        });

        // If the post exists, load data and views ++
        firebase.database().ref('posts/' + props.match.params.string).once('value').then( (snapshot) => { 

            var capture = snapshot.val();

            if(capture){
                
                //Increase number of views of the post
                firebase.database().ref('posts/' + props.match.params.string + '/views').transaction( (value) =>  value + 1 );
                
                // Increase number of views in the user's profile
                firebase.database().ref('users/' + capture.userUid + '/postsViews').transaction( (value) => value + 1);
                
            }
            
        });
        
        // Load all the post info
        firebase.database().ref('posts/' + props.match.params.string).on('value', (snapshot) => { 

            var capture = snapshot.val();

            if(capture){
                
                if(mounted){
                    setEmpty(false);
                    setMessage(capture.message);
                    setTimeStamp(capture.timeStamp);
                    setTitle(capture.title);
                    setUserName(capture.userName);
                    setUserPhoto(capture.userPhoto);
                    setUserUid(capture.userUid);
                    setViews(capture.views);
                }
                
            }
            
        });

        // Load all the replies of the post
        firebase.database().ref('posts/' + props.match.params.string + '/replies/').on('value', (snapshot) => { 

            var array = [];
            var uids = [];

            snapshot.forEach(function(childSnapshot){

                var item = childSnapshot.val();
                item.key = childSnapshot.key;

                array.push(item);

            });
            
            if(mounted){
                setChat(array);
                setReady(true);
            }
        });
        
        return () => {mounted = false};

    }, []);

    const handleSubmit = (e) => {      

      //message can't be empty 
      if(reply === "") setAlert("El mensaje no puede estar vacío.");
      else{      

          firebase.database().ref('users/' + user.uid + '/replies').once('value').then( (snapshot) => {

                var capture = snapshot.val();

                if(capture == null || Date.now() - capture.timeStamp > timeLimit){

                    firebase.database().ref('posts/' + props.match.params.string + '/replies/').push({
                        message: reply,
                        timeStamp: Date.now(),
                        userName: nickName ? nickName : user.displayName,
                        userPhoto: avatar ? avatar : user.photoURL,
                        userUid: nickName ? nickName : user.uid,
                    });
                    
                    //Set timestamp
                    firebase.database().ref('users/' + user.uid + '/replies/timeStamp').transaction( (value) => Date.now() );
                    
                    //Increase number of replies of the users
                    firebase.database().ref('users/' + user.uid + '/replies/numReplies').transaction( (value) => value + 1 );
                    
                    // Notification after user replies something
                    insertNotificationAndReputation(nickName ? nickName : user.uid, 'reply', 'add', points);
                    
                    // Sending ok
                    setReply("");
                    setSend(true);
                    
                    // Disable notification after 2 seconds
                    setTimeout( () => setSend(false), 2000 );
                    
                }
                else{
                        setAlert("Ups, debes esperarte 5 minutos para comentar de nuevo.");
                }
              
          });
      }
        
      e.preventDefault();  
        
    } 
    
    const listQuestion = () => {  
        
      return    <div  key = 'title' className = 'title'>                    
                    {ready && !empty &&
                        <div className = 'detail-header'>
                            <div className = 'Infopost'>
                                <UserAvatar user = {{uid: userUid, photoURL: userPhoto}}/>
                                <div className = 'Group'> 
                                    <span className = 'user-verified'>
                                        <Link to = {'/@' + userUid}>{userName}</Link> 
                                        <PublicInfo uid = {userUid} canvas = 'title'></PublicInfo>
                                        {verified && userUid && verified[userUid] && verified[userUid].badge}
                                    </span>
                                    <TimeAgo formatter={formatter} date={timeStamp}/>
                                </div>
                            </div>
                        </div>
                    }
                </div>;
    }
    
    const listContent = () => {
    
        return <div key = 'content' className = 'content'>
                        {ready && !empty && 
                            <div>
                                <Linkify properties = {{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                                    {/* Start of the user message*/}
                                    {message.split("\n").map((text, key) => <p key = {key}>{text}</p>)}
                                    {/* End of the user messange*/}
                                    <div className = 'Meta-Post'>
                                        <Likes user = {user} post = {props.match.params.string}></Likes>
                                        {user && admin && <EditPost   type = 'post' post = {props.match.params.string}/>}
                                        {user && admin && <DeletePost type = 'post' post = {props.match.params.string} />}
                                    </div>
                                </Linkify>
                            </div>
                        }
                    </div>;
    }
    
    const listItems = () => {
    
    var list = chat.map( (line, index) => 
        <li key = {line.key}>
            <div className = 'Infopost'>
                <UserAvatar user = {{uid: line.userUid, photoURL: line.userPhoto}}/>
                <div className = 'Group'> 
                    <span className = 'user-verified'>
                        <Link to = {'/@' + line.userUid}>{line.userName}</Link>
                        <PublicInfo uid = {line.userUid} canvas = {index}></PublicInfo>
                        {verified && verified[line.userUid] && verified[line.userUid].badge}
                    </span>
                    <TimeAgo formatter = {formatter} date = {line.timeStamp}/>
                </div>
            </div> 
            <Linkify properties={{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                {line.message.split("\n").map((text, key) => <p key = {key}>{text}</p>)}
                <div className = 'Meta-Post'>
                    <LikesComments post = {props.match.params.string} reply = {line.key} user = {user}></LikesComments>
                    {user && admin && <EditPost   type = 'reply' post = {props.match.params.string} reply = {line.key}/>}
                    {user && admin && <DeletePost type = 'reply' post = {props.match.params.string} reply = {line.key} />}
                </div>
            </Linkify>
        </li> );

    var items = <ul key = 'replies' className = 'replies'>{list}</ul>;

    return items;

    } 

    const newReply = () => {

    var form =  <form onSubmit = {(e) => handleSubmit(e)}>
                    {user &&
                     <div className = 'Infopost'>
                        <UserAvatar user = {{uid: user.uid, photoURL: user.photoURL}} allowAnonymousUser = {true}/>
                        <div>{nickName ? nickName : user.displayName}</div>
                      </div>
                    }
                    <div className = 'responseBox'>
                        <EmojiTextarea maxLength = {maxLength} handleChange = {(text) => {setReply(text); setAlert(null)}} send = {send}></EmojiTextarea>
                        <button className = 'send'>Enviar</button>
                    </div>
                </form>;

    return form;

    }
    
    const lastComments = (numberOfComments) => { 
        
        var content = comments.slice(0, numberOfComments).map( (reply, key) =>
            <Link to = {'/comunidad/post/' + reply.pid} key = {key} className = 'Info'>
                <div className = 'Info-Wrap'>
                    <UserAvatar user = {{uid: reply.userUid, photoURL: reply.userPhoto}}/>
                    <div className = 'Author-Date'>
                        <span>{reply.author}</span>
                        <span><TimeAgo formatter = {formatter} date = {reply.timeStamp}/></span>
                    </div>
                </div>
                <div className = 'Claps'>👏  {reply.claps}</div>
            </Link>
        );
      
        content.push(<Link style = {{textAlign: 'center', width: '100%', marginTop: '20px'}} to = '/'>Ver más temas</Link>);
        
        return content;
    }
    
    return (
      <div className = 'Forum Detail'>
        {/* Two columns of content: main content and sidebar */}
        {ready
        ?   <React.Fragment>
            <h2>{title}</h2>
            <div className = 'Forum-TwoCol'>
                <div className = 'Main'>
                    {listQuestion()}
                    {listContent()}
                    {listItems()}
                    {user && !empty && newReply()}                               
                    {!user && ready && !empty  && <button className = 'bottom' onClick = { () => setRender(true)}> Responder</button>}
                </div>
                <div className = 'Sidebar'>
                    {/* General community guidelines */}
                    <div className = 'Norms'>
                        <span className = 'Title'>Antes de publicar</span>
                        <ol>
                            <li className = 'Bien'>Puedes escribir sobre lo que te apetezca: desde Tailandia hasta cualquier otro tema que pueda resultar de interés para la comunidad.</li>
                            <li className = 'Bien'>Escribe como si estuvieses tomándote un café con alguien: sé amable, supón buena fe por parte de los demás, no seas puntilloso. </li>
                            <li className = 'Bien'>Cita la fuente original de tu publicación poniendo la URL sin recortar al final del mensaje.</li>
                            <li className = 'Bien'>Cuida tu ortografía.</li>
                            <li className = 'Mal'>Evita mensajes en mayúsculas o con excesivos puntos de exclamación. </li>
                            <li className = 'Mal'>Evita títulos que empiecen con numerales. Por ejemplo, «5 mejores platos tailandeses» puede ser «Platos tailandeses que son una delicia».</li>
                            <li className = 'Mal'>Si introduces enlaces de afiliado, tu mensaje será borrado.</li>
                        </ol>
                    </div>
                    {/* Two columns of content: main content and sidebar */}
                    <div className = 'LastComments'>
                        <span className = 'Title'>Últimos comentarios</span>
                        {lastComments(10)}
                    </div>
                </div>
            </div>
            </React.Fragment>
        :   <Loading page = 'Main'/>
        }
        {/* Alert messages and login modals */}
        {send  && <Alert title = '¡Gracias!' message = 'Mensaje enviado'></Alert>}
        {alert && <Alert message = {alert}></Alert>}
        {render && <Login hide = {() => setRender(false)}></Login>}
      </div>    
    );
}

export default Detail;
