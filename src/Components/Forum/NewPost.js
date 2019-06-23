import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase, {auth} from '../Firebase.js';
import EmojiTextarea from './EmojiTextarea';
import  '../../Styles/NewPost.css';

class NewPost extends Component {
    
  constructor(){
        
        super();
        this.state = {
            alert: '',
            message: '',
            send: false,
            show: true,
            title: '',
            user: null
        }
  }
    
  componentDidMount  = () => {
      auth.onAuthStateChanged( user => user ? this.setState({ user: user }) : this.setState({ user: null }) );
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  }
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  handleTitle        = (e) => this.setState({ title:   e.target.value});
  handleMessage      = (text)  => this.setState({ message: text});
  handleSubmit       = (e) => {
            
      if(this.state.message === '' || this.state.title === ''){
          this.setState({ alert: 'El título o mensaje no pueden estar vacíos.' });
      }
      else{
          firebase.database().ref('users/' + this.state.user.uid + '/posts').once('value').then( snapshot => {

                var capture = snapshot.val();

                if(capture == null || Date.now() - capture.timeStamp > 86400000 || this.state.user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2'){
                    
                    // Post to database
                    var id = firebase.database().ref('posts/').push({
                        title: this.state.title,
                        message: this.state.message,
                        timeStamp: Date.now(),
                        userName: this.state.user.displayName,
                        userPhoto: this.state.user.photoURL,
                        userUid: this.state.user.uid,
                        votes: 0,
                        views: 0
                    });
                    
                    
                    // Set timeStamp
                    firebase.database().ref('users/' + this.state.user.uid + '/posts/timeStamp').transaction( (value) => Date.now() );
                    
                    // Increase number of views of the user's posts
                    firebase.database().ref('users/' + this.state.user.uid + '/posts/numPosts').transaction( (value) =>  value + 1 );
                    
                    // Get URL
                    var url = id.key;
                    
                    // Remove current alerts
                    this.setState({
                        alert: null,
                        send: true,
                        url: url
                    });
                    
                }
                else{
                        this.setState({
                            alert: 'Ups, solamente se permite un mensaje cada 24 horas. 😳'
                        });
                }

          });
      }
         
      e.preventDefault();
       
  }
  close = () => this.props.hide();
    
  render() {
    return (
        <div className = 'NewPost'>
            
            { !this.state.send
            ? <form onSubmit = {this.handleSubmit}>
                <h2>Escribe tu mensaje</h2>
                <input onChange = {this.handleTitle} className = 'title' placeholder = 'Título...' maxLength = '50'></input>
                <EmojiTextarea handleChange = {this.handleMessage} ></EmojiTextarea>
                <button className = 'bottom'>Enviar</button>
              </form>
            : <div className = 'Enviado'>
                <h2>¡Gracias!</h2>
                <p>Gracias por enviar tu mensaje, puedes verlo haciendo clic {this.state.send  ? <Link onClick = {this.close} to = {'/comunidad/post/' + this.state.url}>aquí</Link> : null}.</p>
              </div>
            }
            {this.state.alert ? <div className = 'Alert'>{alert}</div> : null}
            {this.state.show  ? <div className = 'Invisible' onClick = {this.close} ></div> : null}
        </div>  
    );
  }
}

export default NewPost;