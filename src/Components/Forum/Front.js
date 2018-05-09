import React, { Component } from 'react';
import firebase, {auth} from '../Firebase.js';
import { Link } from 'react-router-dom';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import TimeAgo from 'react-timeago';
import Likes from './Likes.js';
import Login from '../Login.js';
import Forum from '../../Styles/Forum.css';

const formatter = buildFormatter(spanishStrings);

class Front extends Component {
    
  /*******************************************************************/
  //Constructor
  /*******************************************************************/   
  constructor(){
      
        super();
        this.state = {
            admin: false,
            alert: null,
            chat: '',
            message: '',
            nomore: null,
            numposts: 10,
            ready: false,
            render: false,
            title: '',
            user: null,
            write: false,
        }
  }
      
  showBanner = () => this.setState({render: true}); 
  hideBanner = () => this.setState({render: false}); 
    
  /*******************************************************************/
  //componentDidMount -> Auth of the user, last posts and last mssg
  /*******************************************************************/
  componentDidMount = () => {
      
      var that = this;
      
      auth.onAuthStateChanged((user) => {
          this.setState({
              user: user 
          });
          if(user && user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2')
              this.setState({
                 admin: true 
              });
      });
      
      firebase.database().ref('posts/').limitToLast(100).on('value', function(snapshot) { 

        var array = [];

        snapshot.forEach(function(childSnapshot){

            var item = childSnapshot.val();
            item.key = childSnapshot.key;

            array.push(item);

        });
          
        array.reverse();
                    
        that.setState({
            chat: array,
            ready: true
        });

      });
      
  }  
                              
  /*******************************************************************/
  //handleTitle
  /*******************************************************************/
  handleTitle = (e) => this.setState({title: e.target.value});
                               
  /*******************************************************************/
  //handleMessage
  /*******************************************************************/
  handleMessage = (e) => this.setState({message: e.target.value});  
    
  /*******************************************************************/
  //handleSubmit -> Wait 24 hours (86400000 ms) to write new message
  /*******************************************************************/
  handleSubmit = (e) => {
      
      var that = this;
      
      if(this.state.message === '' || this.state.title === ''){
          this.setState({
              alert: 'El título o mensaje no pueden estar vacíos.'
          })
      }
      else{
          firebase.database().ref('users/' + this.state.user.uid + '/posts').once('value').then(function(snapshot) {

                var capture = snapshot.val();

                if(capture == null || Date.now() - capture.timeStamp > 86400000){
           
                    firebase.database().ref('posts/').push({
                        title: that.state.title,
                        message: that.state.message,
                        timeStamp: Date.now(),
                        userName: that.state.user.displayName,
                        userPhoto: that.state.user.photoURL,
                        userUid: that.state.user.uid,
                        votes: 0,
                        views: 0
                    });

                    firebase.database().ref('users/' + that.state.user.uid + '/posts').set({
                        timeStamp: Date.now(),
                    });
                    
                    that.setState({
                        alert: null
                    })
                }
                else{
                        that.setState({
                            alert: 'Ups, solamente se permite un mensaje cada 24 horas. 😳'
                        });
                }

          });
      }
         
      e.preventDefault();
       
  }
     
  /*******************************************************************/
  //handleDelete -> Admin deletes post
  /*******************************************************************/
  handleDelete = (e) => {
      
      firebase.database().ref('posts/' + e.target.getAttribute('id')).remove();
      e.preventDefault();
       
  }   
        
  /*******************************************************************/
  //listItems
  /*******************************************************************/
  listItems = () => {
      
    var array = this.state.chat.slice(0, this.state.numposts);
    var list = array.map( (line, key) =>   
        [<Link to = {'/comunidad/post/' + line.key}>
            <li className='roll' key = {key}>
                {key === 0 
                ?   <div className = 'featured' style = {{backgroundColor: 'var(--darkGray)', height: '500px'}}><span>{line.title}</span></div>
                :   null
                }
                <div className = 'roll-wrap'>
                    {key === 0 
                    ?   null
                    :   <div>{line.title}</div>
                    }
                    <div className = 'infopost'>
                                 <img src = {line.userPhoto}></img>
                                 <p>{line.userName}, <TimeAgo formatter={formatter} date={line.timeStamp}/></p>
                    </div>
                    <div className = 'Meta-Post'>
                        <Likes user={this.state.user} post={line.key}></Likes>
                        <div className = 'Comments'>{line.replies ? '💬 ' + Object.keys(line.replies).length : '💬 0'}</div>
                        <div className = 'Views'>👀 {line.views}</div>
                    </div>
                </div>
            </li>
        </Link>,
        <div>
            {this.state.user && this.state.admin ? <button className='delete' id={line.key} onClick={this.handleDelete}>Eliminar</button> : null}
        </div>]);
                                       
    return list;
       
  }  
          
  /*******************************************************************/
  //listItems
  /*******************************************************************/
  newPost = () => {
    
    var form = <form onSubmit={this.handleSubmit}>
            {this.state.alert 
            ? <span className='alert'>{this.state.alert}</span> 
            : null
            }
            <h2>Escribe tu mensaje</h2>
            <input onChange = {this.handleTitle} className='title' placeholder = 'Título...' maxLength = '50'></input>
            <textarea onChange = {this.handleMessage} className = 'message' placeholder = 'Mensaje...' maxLength = '280'></textarea>
            <button className = 'bottom'>Enviar</button>
        </form>;

    return form;
  }    
      
  /*******************************************************************/
  //cargando
  /*******************************************************************/
  loading = () => <div><div className='bloque-100'></div><div className='bloque-90'></div><div className='bloque-80'></div></div>
      
  /*******************************************************************/
  //carga más publicaciones
  /*******************************************************************/   
  showMorePosts = () => {
      var items  = this.state.numposts + 5;
      var length = this.state.chat.length;
         
      if(items >= length) this.setState({ nomore: true });
         
      this.setState({ numposts: items });
  }

  render() {
      
      
    return (
      <div className = 'Forum'>
        <h2>Comunidad</h2>
        <ul className = 'Front'>{this.state.ready ? this.listItems() : this.loading()}</ul>
        {this.state.user                         ? this.newPost() : null}
        {this.state.user    || !this.state.ready ? null : <button className = 'bottom' onClick={this.showBanner}>Publicar</button>}
        {this.state.nomore  || !this.state.ready ? null : <button className = 'more'   onClick = {this.showMorePosts}>Ver más</button>}
        {this.state.render                       ? <Login hide={this.hideBanner}></Login> : null}
      </div>
    );
  }
}

export default Front;
