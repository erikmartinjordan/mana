import React, { Component } from 'react';
import firebase, {auth} from './Firebase.js';
import '../Styles/Notifications.css';

class Notifications extends Component {  
    
  //--------------------------------------------------------------/
  //
  // Declaring inital state
  //
  //--------------------------------------------------------------/
  state = {
     points: 0,
     show: false
  }

  //--------------------------------------------------------------/
  //
  // After component is mounted
  //
  //--------------------------------------------------------------/
  componentDidMount  = () => {
      
      // Getting the data users current points
      firebase.database().ref('users/' + this.props.user + '/points').on('value', snapshot => { 
            
            // Setting state with the current points
            var dbPoints = snapshot.val();            
            dbPoints ? this.setState({ points: dbPoints }) : dbPoints = 0;
          
            // Calculate the current points
            this.calculateCurrentPoints(dbPoints);
                    
      });
      
      // Setting emojis in svg
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
      
  }
  
  //--------------------------------------------------------------/
  //
  // After an update of the component
  //
  //--------------------------------------------------------------/
  componentDidUpdate = () => {
      
      // Setting emojis in svg
      window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
      
  }
  
  //--------------------------------------------------------------/
  //
  // Hide notifications modal
  //
  //--------------------------------------------------------------/
  hideNotifications = () => this.setState({ show: false });

  //--------------------------------------------------------------/
  //
  // Show notifications modal
  //
  //--------------------------------------------------------------/
  showNotifications = () => this.setState({ show: true });

  //--------------------------------------------------------------/
  //
  // Calculating the current points and level
  //
  //--------------------------------------------------------------/
  calculateCurrentPoints = (number) => {
      
      var points, diff, visits = 0, posts = 0, replies = 0, spicy = 0;
            
      // Getting the data users current points
      firebase.database().ref('users/' + this.props.user).once('value').then( snapshot => { 
            
            // Capturing data
            var capture = snapshot.val(); 
                    
            if(capture) {
                
                // Setting variables
                if(typeof capture.postsViews !== 'undefined') visits = capture.postsViews;
                if(typeof capture.posts.numPosts !== 'undefined') posts = capture.posts.numPosts;
                if(typeof capture.replies.numReplies !== 'undefined') replies = capture.replies.numReplies;
                if(typeof capture.spicy !== 'undefined') spicy = capture.spicy;
                
                // Calculating points
                points = (2 * visits) + (3 * posts) + (4 * replies) + (5 * spicy);
                
                // Calculating the difference between database points and current points
                diff = points - this.state.points;
                
                // If points are different from state (database), generate a notification
                if(diff !== 0){    
                        firebase.database().ref('notifications/' + this.props.user).push({ points: points });
                }
                
            }

      });
  }
      
  //--------------------------------------------------------------/
  //
  // Getting the notifications from the database
  //
  //--------------------------------------------------------------/
  getNotifications = (number) => {
      
      var url = 'https://lh6.googleusercontent.com/-WwLYxZDTcu8/AAAAAAAAAAI/AAAAAAAAZF4/6lngnHRUX7c/photo.jpg';
      var points = 30;
      var message = 'Prueba';
      
      var notifications = <div className = 'Notifications-Menu'>
                                <div className = 'Notifications-Content'>
                                        <span className = 'Notifications-Photo'><img src = {url}></img></span>
                                        <span className = 'Notifications-Points'>{points}</span>
                                        <span className = 'Notifications-Message'>{message}</span>
                                </div>
                          </div>;
      
      return notifications;
      
  }
    
  render() {
    return (
        <div>
        <div className = 'Notifications'>
            <div className = 'Notifications-Icon' onClick = {this.showNotifications}>
                <div className = 'Notifications-Logo' onClick = {this.showNotifications}>🔔</div>
                <span className = 'Notifications-Number'>9</span>
            </div>
            {this.state.show ? this.getNotifications(10) : null}
        </div>
            {this.state.show ? <div onClick = {this.hideNotifications} className = 'Invisible'></div> : null}
        </div>
    );
  }
}

export default Notifications;