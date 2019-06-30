import React, { Component } from 'react';
import firebase, {auth} from '../Firebase.js';
import { Link } from 'react-router-dom';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import TimeAgo from 'react-timeago';
import Linkify from 'react-linkify';
import Likes from './Likes.js';
import LikesComments from './LikesComments.js';
import Login from '../Login.js';
import EmojiTextarea from './EmojiTextarea';

const formatter = buildFormatter(spanishStrings);

class Detail extends Component {  
    
  /*******************************************************************/
  //Constructor
  /*******************************************************************/   
  constructor(){
      
        super();
        this.state = {
            admin: false,
            alert: null,
            empty: true,
            login: false,
            message: "",
            ready: false,
            render: false,
            reply: "",
            send: false,
            timeStamp: null,
            title: "",
            user: "",
            userName: "",
            userPhoto: "",
            userUid: "",
            views: "",
        }
  }
    
  /*******************************************************************/
  //showBanner
  /*******************************************************************/
  showBanner = () => this.setState({render: true}); 
    
  /*******************************************************************/
  //hideBanner
  /*******************************************************************/
  hideBanner = () => this.setState({render: false}); 
  
  /*******************************************************************/
  //componentDidMount
  /*******************************************************************/
  componentDidMount = () => {
            
      //--------------------------------------------------------------/
      //if uid = admin_id -> admin: true
      //--------------------------------------------------------------/
      auth.onAuthStateChanged( (user) => {
          this.setState({ user: user });
          if(user && user.uid === "dOjpU9i6kRRhCLfYb6sfSHhvdBx2")this.setState({ admin: true });
      });
      
      //--------------------------------------------------------------/
      //if the post exists, load data and views ++
      //--------------------------------------------------------------/
      firebase.database().ref('posts/' + this.props.match.params.string).once('value').then( (snapshot) => { 

            var capture = snapshot.val();
          
            if(capture){

                this.setState({
                    empty: false,
                    message: capture.message,
                    timeStamp: capture.timeStamp,
                    title: capture.title,
                    userName: capture.userName,
                    userPhoto: capture.userPhoto,
                    userUid: capture.userUid,
                    views: capture.views
                });
                
                //Increase number of views of the post
                firebase.database().ref('posts/' + this.props.match.params.string + '/views').transaction( (value) =>  value + 1 );
                
                // Increase number of views in the user's profile
                firebase.database().ref('users/' + capture.userUid + '/postsViews').transaction( (value) => value + 1);
                
            }

      });
            
      //--------------------------------------------------------------/
      //load all the replies of the post
      //--------------------------------------------------------------/      
      firebase.database().ref('posts/' + this.props.match.params.string + '/replies/').on('value', (snapshot) => { 

            var array = [];

            snapshot.forEach(function(childSnapshot){

                var item = childSnapshot.val();
                item.key = childSnapshot.key;

                array.push(item);

            });
          
            this.setState({
                chat: array,
                ready: true
            });
      });
      
      //--------------------------------------------------------------/
      //load verified badges
      //--------------------------------------------------------------/ 
      firebase.database().ref('users/').once('value').then( snapshot => this.setState({verified: snapshot.val()}) );
      
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
                
  }  
  
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
                                  
  /*******************************************************************/
  //handleReply
  /*******************************************************************/
  handleReply = (text)  => this.setState({ reply: text});
    
  /*******************************************************************/
  //handleSubmit
  /*******************************************************************/
  handleSubmit = (e) => {      
      //--------------------------------------------------------------/
      //message can't be empty
      //--------------------------------------------------------------/ 
      if(this.state.message === "") this.setState({ alert: "El mensaje no puede estar vacío." });
      //--------------------------------------------------------------/
      //only one reply, every 5 mins
      //--------------------------------------------------------------/ 
      else{      
          
          firebase.database().ref('users/' + this.state.user.uid + '/replies').once('value').then( (snapshot) => {

                var capture = snapshot.val();

                if(capture == null || Date.now() - capture.timeStamp > 300000 || this.state.user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2'){

                    firebase.database().ref('posts/' + this.props.match.params.string + '/replies/').push({
                        message: this.state.reply,
                        timeStamp: Date.now(),
                        userName: this.state.user.displayName,
                        userPhoto: this.state.user.photoURL,
                        userUid: this.state.user.uid,
                    });

                    //Set timestamp
                    firebase.database().ref('users/' + this.state.user.uid + '/replies/timeStamp').transaction( (value) => Date.now() );
                    
                    //Increase number of replies of the users
                    firebase.database().ref('users/' + this.state.user.uid + '/replies/numReplies').transaction( (value) => value + 1 );
                                        
                    this.setState({ 
                        reply: "",
                        send: true
                    });
                    
                    setTimeout( () => this.setState({ send: false }), 2000 );

                }
                else{
                        this.setState({ alert: "Ups, debes esperarte 5 minutos para comentar de nuevo." });
                }

          });
      }
         
      e.preventDefault();  
       
  } 
    
  /*******************************************************************/
  //handleDelete -> Admin deletes post
  /*******************************************************************/
  handleDeletePost = (e) => firebase.database().ref('posts/' + this.props.match.params.string).remove();
             
  /*******************************************************************/
  //handleDeleteReply -> Admin deletes reply
  /*******************************************************************/
  handleDeleteReply = (e) => {
      
      firebase.database().ref('posts/' + this.props.match.params.string + '/replies/' + e.target.getAttribute("id") ).remove();
      e.preventDefault();
       
  } 
    
  /*******************************************************************/
  //display title
  /*******************************************************************/
  listTitle = () => {  
       
      var title =  <div className="title">
            {this.state.ready && this.state.empty ? 
            <div>
                <h2>Ups, esta página no existe</h2>
                <button className="bottom">
                    <Link to="/"><i className="fa fa-arrow-left" aria-hidden="true"></i> Volver </Link>
                </button>
            </div>
                                            
            : 
            
            null}
                                            
            
            {this.state.ready && !this.state.empty ? 
                <div className="detail-header">
                    <div className="infopost center">
                        <h2>{this.state.title}</h2>
                    </div>
                    <div className="infopost center">
                        <img alt={this.state.userName} src={this.state.userPhoto}></img>
                        <div>{this.state.userName} {this.state.verified && this.state.verified[this.state.userUid].verified ? <span><span className = "verified">✓</span><span className = "tooltip">Cuenta verificada</span></span> : null} <TimeAgo formatter={formatter} date={this.state.timeStamp}/></div>
                    </div>
                </div>
                                            
            : 
            
            null}
    
        </div>;

        return title;

  }
      
  /*******************************************************************/
  //listContent
  /*******************************************************************/
  listContent = () => {
      
        var message = this.state.message.split("\n").map(text => <p>{text}</p>);
                                                         
        var content = <div className="content">
                        {this.state.ready && !this.state.empty ? 
                            <div>
                            <Linkify properties={{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                                {message}
                                <Likes user={this.state.user} post={this.props.match.params.string}></Likes>
                            </Linkify>
                            {this.state.user && this.state.admin ? 
                                <Link to ="/"><button className="delete" id={this.props.match.params.string} onClick={this.handleDeletePost}>Eliminar todo el artículo</button></Link>
                            :

                            null}
                            </div>

                        :

                        null}
                    </div>;

        return content;

  }
    
  /*******************************************************************/
  //listItems
  /*******************************************************************/
  listItems = () => {
      
    var list = this.state.chat.map( (line, index) => 
        
        <li key={line.key}>
            <div><img alt={line.userName} src={line.userPhoto}></img></div>
            <div className="infopost">
                {line.userName} {this.state.verified && this.state.verified[line.userUid].verified ? 
                                <span><span className = "verified">✓</span><span className = "tooltip">Cuenta verificada</span></span> : null}<TimeAgo formatter={formatter} date={line.timeStamp}/>
            </div> 
            <Linkify properties={{target: '_blank', rel: 'nofollow noopener noreferrer'}}>
                { line.message.split("\n").map(text => <p>{text}</p>) }
                <LikesComments post = {this.props.match.params.string} reply = {line.key} user = {this.state.user}></LikesComments>
            </Linkify>
            <div>{this.state.admin ? <button className="delete" id={line.key} onClick={this.handleDeleteReply}>Eliminar comentario</button> : null}</div>
        </li> );
                                       
    return list;
       
  } 
    
  /*******************************************************************/
  //newReply()
  /*******************************************************************/
  newReply = () => {
                    
    var form =  <form onSubmit={this.handleSubmit}>
                    {this.state.alert ? <span className="alert">{this.state.alert}</span> : null}
                    <div className="title">
                        <h2>Escribe tu respuesta</h2>
                    </div>
                    <EmojiTextarea handleChange = {this.handleReply} ></EmojiTextarea>
                    <button className="bottom">Enviar</button>
                </form>;
            
    return form;

  }
        
  /*******************************************************************/
  //render
  /*******************************************************************/    

  render() {
      
    this.state.title    ? document.title = this.state.title + ' - Nomoresheet' : null; 
    this.state.message  ? document.querySelector('meta[name="description"]').content = this.state.message : null; 
                        
    return (
      <div className = 'Forum'>
        
        { this.state.send === true 
        ? <div className = 'Send'>
            <span>👍 Enviado</span>
          </div> 
        : null 
        }
        
        {this.listTitle()}   
        {this.listContent()}
            
        <ul className="replies">
            {this.state.ready ? this.listItems() : "Cargando..."}
        </ul>
            
        {this.state.user && !this.state.empty ?  this.newReply() : null}                               
        {this.state.user || !this.state.ready ||this.state.empty ? null: <button className="bottom" onClick={this.showBanner}>Responder</button>}
         
        {this.state.render ? <Login hide={this.hideBanner}></Login> : null}
      </div>    
    );
  }
}

export default Detail;
