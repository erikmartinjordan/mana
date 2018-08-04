import React, { Component } from 'react';
import firebase, {auth} from '../Firebase.js';
import { Link } from 'react-router-dom';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import TimeAgo from 'react-timeago';
import Likes from './Likes.js';
import Login from '../Login.js';
import EmojiTextarea from './EmojiTextarea';
import '../../Styles/Forum.css';

const formatter = buildFormatter(spanishStrings);

class Front extends Component {
       
  constructor(){
      
        super();
        this.state = {
            admin: false,
            alert: '',
            chat: '',
            message: '',
            nomore: null,
            numposts: 10,
            ready: false,
            render: false,
            send: false,
            sort: 'nuevo',
            title: '',
            user: null,
            write: false,
        }
  }
      
  showBanner = () => this.setState({render: true}); 
  hideBanner = () => this.setState({render: false}); 
    
  //-------------------------------------------------------------
  //
  // Auth of user and last message
  //
  //------------------------------------------------------------- 
  componentDidMount = () => {
            
      auth.onAuthStateChanged( user => {
          if(user){
              if(user.uid === 'dOjpU9i6kRRhCLfYb6sfSHhvdBx2') this.setState({ admin: true });
              this.setState({ user: user });
          }
          else{
              this.setState({ user: null});
          }
      });
      
      firebase.database().ref('posts/').limitToLast(100).on('value', snapshot => { 

        var array = [];

        snapshot.forEach( childSnapshot => {

            var item = childSnapshot.val();
            item.key = childSnapshot.key;

            array.push(item);

        });
          
        array.reverse();
                    
        this.setState({
            chat: array,
            ready: true
        });

      });
      
    document.title = 'Nomoresheet'; 
    document.querySelector('meta[name="description"]').content = 'Comunidad de Tailandia'; 
      
    window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
      
  }
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  //-------------------------------------------------------------
  //
  // Handle elements
  //
  //-------------------------------------------------------------   
  handleTitle = (e)       => this.setState({ title:   e.target.value});
  handleMessage = (text)  => this.setState({ message: text});
  handleImageChange = (e) => {
    e.preventDefault();
      
    let reader = new FileReader();
    let file = e.target.files[0];
                                               
    reader.onloadend = () => this.setState({ file: file, featuredImageUrl: reader.result });
    reader.readAsDataURL(file)
  }
    
  //-------------------------------------------------------------
  //
  // handleSubmit -> Wait 24 hours (86400000 ms) to write new message
  //
  //-------------------------------------------------------------  
  handleSubmit = (e) => {
            
      if(this.state.message === '' || this.state.title === ''){
          this.setState({ alert: 'El título o mensaje no pueden estar vacíos.' });
      }
      else{
          firebase.database().ref('users/' + this.state.user.uid + '/posts').once('value').then( snapshot => {

                var capture = snapshot.val();

                if(capture == null || Date.now() - capture.timeStamp > 86400000){
                    
                    // Background array urls
                    var featured;
                    var backg = [
                                'https://images.unsplash.com/photo-1503933166348-a1a86c17b3a0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=625fe6fd55bfcc756490582ae368b210&auto=format&fit=crop&w=1050&q=80',
                                'https://images.unsplash.com/photo-1523613002-bbcd22be7f02?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=31e5b6b81b6491708f6d2285ec50a1b8&auto=format&fit=crop&w=1052&q=80',
                                'https://images.unsplash.com/5/car.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1a5f9075c6bb28fb3c7c44441adf930b&auto=format&fit=crop&w=1492&q=80',
                                'https://images.unsplash.com/reserve/fPuLkQNXRUKI6HQ2cMPf_IMG_4761.jpg?ixlib=rb-0.3.5&s=35b25e46cf680e8f398f5a3b9e5deb8f&auto=format&fit=crop&w=1050&q=80',
                                'https://images.unsplash.com/photo-1490077476659-095159692ab5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b66d15c291f8357f5206cc0ba9dc46ba&auto=format&fit=crop&w=1033&q=80',
                                'https://images.unsplash.com/photo-1421284621639-884f4129b61d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3ecb7eef4f8b6d99797f28808f331659&auto=format&fit=crop&w=1050&q=80',
                                'https://images.unsplash.com/photo-1514862461281-d9a41da4180e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=57c5863290b075514cd7a57d4f96ef47&auto=format&fit=crop&w=1051&q=80'
                    ];
                    
                    // Random background if user didn't post anything
                    this.state.featuredImageUrl 
                    ? featured = this.state.featuredImageUrl 
                    : featured = backg[Math.floor(Math.random() * (backg.length))];
                    
                    // Post to database
                    firebase.database().ref('posts/').push({
                        title: this.state.title,
                        message: this.state.message,
                        featuredImageUrl: featured,
                        timeStamp: Date.now(),
                        userName: this.state.user.displayName,
                        userPhoto: this.state.user.photoURL,
                        userUid: this.state.user.uid,
                        votes: 0,
                        views: 0
                    });

                    firebase.database().ref('users/' + this.state.user.uid + '/posts').set({
                        timeStamp: Date.now(),
                    });
                    
                    // Remove current alerts
                    this.setState({
                        alert: null,
                        send: true
                    });
                    
                    // Notification off after 5 secs 
                    setTimeout( () => this.setState({ send: false}), 2000 );
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
     
  //-------------------------------------------------------------
  //
  // admin deletes a post
  //
  //------------------------------------------------------------- 
  handleDelete = (e) => {
      
      firebase.database().ref('posts/' + e.target.getAttribute('id')).remove();
      e.preventDefault();
       
  }   
        
  //-------------------------------------------------------------
  //
  // list of items
  //
  //------------------------------------------------------------- 
  listItems = () => {
    
    // Number of messages depending on user's choice  
    var array = this.state.chat.slice(0, this.state.numposts);
    
    // Enumerate list of posts  
    var list = array.map( (line, key) =>   
        [<Link to = {'/comunidad/post/' + line.key}>
            <li className='roll' key = {key}>
                { key === 0 
                ? <div  className = 'featured' 
                        style = {{ backgroundImage: 'url(' + line.featuredImageUrl + ')', 
                                   backgroundSize: 'cover', 
                                   backgroundPosition: 'center center',
                                   backgroundRepeat: 'no-repeat',
                                   height: '500px'
                                }}>
                        <span className = 'title'>
                            <div>{line.title}</div>
                        </span>
                  </div>
                : null
                }
                <div className = 'roll-wrap'>
                    { key === 0 
                    ? null
                    : <span>{line.title}</span>
                    }
                    <div className = 'Infopost-Meta-Post'>
                        <div className = 'infopost'>
                            <img src = {line.userPhoto}></img>
                            <p>{line.userName}, <TimeAgo formatter={formatter} date={line.timeStamp}/></p>
                        </div>
                        <div className = 'Meta-Post'>
                            <div className = 'Likes'>🌶️ {line.votes * -1}</div>
                            <div className = 'Comments'>{line.replies ? '💬 ' + Object.keys(line.replies).length : '💬 0'}</div>
                            <div className = 'Views'>✨ {line.views} visitas</div>
                        </div>
                    </div>
                </div>
            </li>
        </Link>,
        <div>
            {this.state.user && this.state.admin ? <button className='delete' id={line.key} onClick={this.handleDelete}>Eliminar</button> : null}
        </div>]);
                                       
    return list;
       
  }  
          
  //-------------------------------------------------------------
  //
  // form to write a new post
  //
  //------------------------------------------------------------- 
  newPost = () => {
    
    var form = <form onSubmit={this.handleSubmit}>
            { this.state.alert 
            ? <span className='alert'>{this.state.alert}</span> 
            : null
            }
            <h2>Escribe tu mensaje</h2>
            <div className = 'Upload'>
                <input type = 'file' onChange = {this.handleImageChange} />
                { this.state.featuredImageUrl
                ? <div className = 'Image' style = {{
                        backgroundImage: 'url(' + this.state.featuredImageUrl + ')', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center'}}>
                  </div> 
                : null
                }
                <button>Subir foto</button> 
            </div>
            <input onChange = {this.handleTitle} className='title' placeholder = 'Título...' maxLength = '50'></input>
            <EmojiTextarea handleChange = {this.handleMessage} ></EmojiTextarea>
         
            <button className = 'bottom'>Enviar</button>
        </form>;

    return form;
  }    
      
  //-------------------------------------------------------------
  //
  // loading blocks, fancy effect
  //
  //------------------------------------------------------------- 
  loading = () =>{ return <div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                            <div className = 'loading' style = {{background: 'gray'}}></div>
                          </div> }
      
  //-------------------------------------------------------------
  //
  // show more posts
  //
  //-------------------------------------------------------------    
  showMorePosts = () => {
      var items  = this.state.numposts + 5;
      var length = this.state.chat.length;
         
      if(items >= length) this.setState({ nomore: true });
         
      this.setState({ numposts: items });
  }
      
  //-------------------------------------------------------------
  //
  // order by newest, comments and views
  //
  //-------------------------------------------------------------    
  orderBy = (type) => {
         
         let sorted;
                          
         if(type === 'nuevo')       sorted = this.state.chat.sort( (a, b) => b.timeStamp - a.timeStamp );
         if(type === 'picante')     sorted = this.state.chat.sort( (a, b) => a.votes - b.votes );
         if(type === 'comentarios') sorted = this.state.chat.sort( (a, b) => {
                  
            if(a.replies  && b.replies)   return Object.keys(b.replies).length - Object.keys(a.replies).length;
            if(!a.replies && b.replies)   return 1;
            if(a.replies  && !b.replies)  return -1;
            if(!a.replies && !b.replies)  return 0;
         
         });
                  
         this.setState({ 
            chat: sorted,
            sort: type
         });

  }
         
  render() {      
      
    return (
      <div className = 'Forum'>

        {this.state.user 
        ? this.newPost() 
        : <h2></h2>
        }
         
        { this.state.chat !== ''
        ? <div className = 'OrderBy'>
                <div onClick = {() => this.orderBy('nuevo')}       className = {this.state.sort === 'nuevo'       ? 'Selected' : null}>Nuevo 🔥</div>
                <div onClick = {() => this.orderBy('picante')}     className = {this.state.sort === 'picante'     ? 'Selected' : null}>Picante 🌶</div>
                <div onClick = {() => this.orderBy('comentarios')} className = {this.state.sort === 'comentarios' ? 'Selected' : null}>Comentarios 💬</div>
          </div>
        : null
        }
        
        { this.state.send === true 
        ? <div className = 'Send'>
            <span>👍 Enviado</span>
          </div> 
        : null 
        }

        <ul className = 'Front'>
            {this.state.ready ? this.listItems() : this.loading()}
        </ul>

        {this.state.nomore || !this.state.ready ? null : <button className = 'more' onClick = {this.showMorePosts}>Ver más</button>}
        {this.state.render ? <Login hide={this.hideBanner}></Login> : null}
      </div>
    );
  }
}

export default Front;
