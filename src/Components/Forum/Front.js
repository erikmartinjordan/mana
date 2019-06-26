import React, { Component } from 'react';
import firebase, {auth} from '../Firebase.js';
import { Link } from 'react-router-dom';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import TimeAgo from 'react-timeago';
import Likes from './Likes.js';
import Login from '../Login.js';
import Data from '../../Posts/_data.js';
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
      
    // Get unique pics arrray
    var photos = [];
    var unique = [];
    photos = array.map( (line, key) => Object.keys(line.replies).map( (reply, key)  => line.replies[reply].userPhoto));   
    for(var i = 0; i < photos.length; i ++) unique[i] = [...new Set(photos[i])]
                    
    // Enumerate list of posts  
    var list = array.map( (line, key) =>
        <React.Fragment>
            <Link to = {'/comunidad/post/' + line.key}>
                <li className='roll' key = {key}>
                    <div className = 'roll-wrap'>
                        <span>{line.title}</span>
                        <div className = 'Infopost-Meta-Post'>
                            <div className = 'infopost'>
                                <img src = {line.userPhoto}></img>
                                <p>{line.userName}, <TimeAgo formatter={formatter} date={line.timeStamp}/></p>
                            </div>
                            <div className = 'Meta-Post'>
                                <div className = 'Likes'>🌶️ {line.votes * -1}</div>
                                <div className = 'Comments'>{line.replies ? '💬 ' + Object.keys(line.replies).length : '💬 0'}</div>
                                {unique[key].map( (photo, key) =>         
                                  <div className = 'Multi-Pic'>
                                     <img key = {key} src = {photo}></img>
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>
                </li>
            </Link>
            <div> {this.state.user && this.state.admin ? <button className = 'delete' id = {line.key} onClick = {this.handleDelete}>Eliminar</button> : null} </div>
        </React.Fragment>
      );

    return list;
       
  }   
      
  //-------------------------------------------------------------
  //
  // loading blocks, fancy effect
  //
  //------------------------------------------------------------- 
  loading = () => <React.Fragment>
                    <div className = 'OrderBy'>
                        <div className = 'Loading'></div>
                        <div className = 'Loading'></div>
                        <div className = 'Loading'></div>
                    </div>
                     <div className = 'Forum-TwoCol'>
                        <ul className = 'Front'>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>
                            <div className = 'Loading'></div>                       
                        </ul>
                        <div className = 'Sidebar'>
                                <div className = 'Loading'></div> 
                                <div className = 'Loading'></div> 
                        </div>
                     </div>
                </React.Fragment>
      
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
  
  //-------------------------------------------------------------
  //
  // get last comments, author and link
  //
  //-------------------------------------------------------------    
  lastComments = (numberOfComments) => {
       
      // Getting all the array of posts
      var posts = this.state.chat;
            
      // Declaring replies array
      var replies = [];
      
      // Declaring keys array of the parents
      var keysParents = [];
      
      // Declaring keys array of the children
      var keysChildren = [];
      
      // Declaring timeStamps
      var timeStamps = [];
      
      // Declaring userPhotos
      var userPhotos = [];
      
      // Declaring userNames
      var userNames = [];
      
      // Max timeStamps indexes
      var maxIndexes = [];
            
      // Getting an array of replies
      posts.map( (post) => {
          
          if(typeof post.replies !== 'undefined'){
            replies.push(post.replies);
            for(var j = 0; j < Object.keys(post.replies).length; j ++)
              keysParents.push(post.key);   
          }
      });
      
      // Getting keys, timeStamps, userPhotos and userNames of all replies
      for(var i = 0; i < replies.length; i ++){
          
          Object.keys(replies[i]).map( (key) => keysChildren.push(key));
          Object.keys(replies[i]).map( (key) => timeStamps.push(replies[i][key].timeStamp)); 
          Object.keys(replies[i]).map( (key) => userPhotos.push(replies[i][key].userPhoto)); 
          Object.keys(replies[i]).map( (key) => userNames.push(replies[i][key].userName)); 
                    
      }
      
      // Getting max timeStamps indexes
      var topTimeStamps = [...timeStamps];
      topTimeStamps = topTimeStamps.sort( (a, b) => b - a).slice(0, numberOfComments);
      
      // Getting indexes of elements
      for(var i = 0; i < topTimeStamps.length; i ++){
          
          maxIndexes.push(timeStamps.indexOf(topTimeStamps[i]));
      }
      
      // Printing last comments
      var lastComments = maxIndexes.map( (value, key) => {
          
          return <div className = 'Info'>
                    <img src = {userPhotos[value]}></img>
                    <Link to = {'/comunidad/post/' + keysParents[value]}>{userNames[value]}</Link>
                    <span>, <TimeAgo formatter = {formatter} date = {timeStamps[value]}/></span>
                 </div>
      
      });
          
      return lastComments;
  }
  
  
  //-------------------------------------------------------------
  //
  // get last articles
  //
  //-------------------------------------------------------------    
  lastArticles = (numberOfArticles) => {
      
      var lastArticles; 
      
      lastArticles = Object.keys(Data).map( (key) => {
          
          return <div className = 'Info'>
                      <div className = 'Bullet'></div>  
                      <Link to = {'/' + key}>{Data[key].title}</Link>
                 </div>
      });
          
      lastArticles = lastArticles.slice(0, numberOfArticles); 
      
      return lastArticles;
  }
         
  render() {      
      
    return (
      <div className = 'Forum'>
        
        { this.state.ready && this.state.chat !== ''
        ?   <React.Fragment>
                <div className = 'OrderBy'>
                    <div onClick = {() => this.orderBy('nuevo')}       className = {this.state.sort === 'nuevo'       ? 'Selected' : null}>Nuevo 🔥</div>
                    <div onClick = {() => this.orderBy('picante')}     className = {this.state.sort === 'picante'     ? 'Selected' : null}>Picante 🌶</div>
                    <div onClick = {() => this.orderBy('comentarios')} className = {this.state.sort === 'comentarios' ? 'Selected' : null}>Comentarios 💬</div>
                </div>
                <div className = 'Forum-TwoCol'>
                    <ul className = 'Front'>
                        {this.listItems()}
                    </ul>
                    <div className = 'Sidebar'>
                        <div className = 'LastComments'>
                            <span className = 'Title'>Últimos comentarios</span>
                            {this.state.ready ? this.lastComments(10) : null}
                        </div>
                        <div className = 'LastArticles'>
                            <span className = 'Title'>Últimos artículos</span>
                            {this.state.ready ? this.lastArticles(5) : null}
                        </div>
                        { !this.state.user
                        ? <div className = 'Welcome'>
                            <span className = 'Title'>Únete</span>
                            <p>👋 ¡Hola! Accede a la comunidad para poder publicar y responder a otros <em>posts</em>.</p>
                            <a className = 'login' onClick = {this.showBanner}>Acceder</a>
                          </div>
                        : null }
                    </div>
                </div>
            </React.Fragment>
        : this.loading()}

        {this.state.nomore || !this.state.ready ? null : <button className = 'more' onClick = {this.showMorePosts}>Ver más</button>}
        {this.state.render ? <Login hide={this.hideBanner}></Login> : null}
      </div>
    );
  }
}

export default Front;
