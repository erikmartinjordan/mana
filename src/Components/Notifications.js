import React, { Component } from 'react';
import firebase, {auth} from './Firebase.js';
import countVotesRepliesSpicy from './ReturnVotesRepliesSpicy.js';
import '../Styles/Notifications.css';

class Notifications extends Component {  
    
  //--------------------------------------------------------------/
  //
  // Declaring inital state
  //
  //--------------------------------------------------------------/
  state = {
     notifications: [],
     points: 0,
     show: false
  }

  //--------------------------------------------------------------/
  //
  // After component is mounted
  //
  //--------------------------------------------------------------/
  componentDidMount  = () => {
      
      // Getting the user current points of database
      firebase.database().ref('users/').on('value', snapshot => { 
            
            // Capturing data
            var dbPoints = snapshot.val()[this.props.user.uid].points; 
          
            // Setting the state
            this.setState({ points: dbPoints ? dbPoints : 0 });
          
            // Calculate the current points
            this.calculateCurrentPoints(dbPoints ? dbPoints : 0);
                    
      });
      
      
      // Getting the notifications 
      firebase.database().ref('notifications/' + this.props.user.uid).on('value', snapshot => { 
          
          // Capturing data
          var notifications = snapshot.val();
          var array = [];
          
          // Array of points
          notifications ? array = Object.keys(notifications).map( id => notifications[id].points ) : notifications; 
          
          // Setting the state
          this.setState({ notifications: array });
          
      });
      
      // Getting the user current points of database
      firebase.database().ref('posts/').on('value', snapshot => { 
          
            // Calculate the current points
            this.calculateCurrentPoints(this.state.points);
                    
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
  calculateCurrentPoints = async (number) => {
      
      var points, diff, posts, replies, spicy, res = [];
       
      // Getting the points
      res = await countVotesRepliesSpicy(this.props.user.uid);
      
      // Assigning to variables
      posts = res[0];
      replies = res[1];
      spicy = res[2];
      
      // Calculating points
      points = (30 * posts) + (40 * replies) + (50 * spicy);

      // Calculating the difference between database points and current points
      diff = points - this.state.points;

      // If points are different from state (database), generate a notification and update user's points
      if(diff !== 0){    
                firebase.database().ref('notifications/' + this.props.user.uid).push({ points: points });
                firebase.database().ref('users/' + this.props.user.uid + '/points').transaction( value => points );
      }

  }
      
  //--------------------------------------------------------------/
  //
  // Represent notifications
  //
  //--------------------------------------------------------------/
  getNotifications = (number) => {
      
      var points;
      var res;
                                                
      // Drawing block
      res = this.state.notifications.map( points =>
                <div className = 'Notifications-Content'>
                    <span className = 'Notifications-Photo'><img src = {this.props.user.photoURL}></img></span>
                    <span className = 'Notifications-Points'>+{points}</span>
                    <span className = 'Notifications-Message'>Enhorabuena, has conseguido un montón de puntos.</span>
                </div>          
      );
            
      return res;
      
  }
  
    
  render() {
    return (
        <React.Fragment>
            <div className = 'Notifications'>
                <div className = 'Notifications-Icon' onClick = {this.showNotifications}>
                    <div className = 'Notifications-Logo' onClick = {this.showNotifications}>🔔</div>
                    {this.state.notifications.length > 0 && <span className = 'Notifications-Number'>{this.state.notifications.length}</span>}
                </div>
                {this.state.show && <div className = 'Notifications-Menu'>{this.getNotifications(10)}</div>}
            </div>
                {this.state.show && <div onClick = {this.hideNotifications} className = 'Invisible'></div>}
        </React.Fragment>
    );
  }
}

export default Notifications;