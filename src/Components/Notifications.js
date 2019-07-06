import React, { Component } from 'react';
import firebase, {auth} from './Firebase.js';
import '../Styles/Notifications.css';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import TimeAgo from 'react-timeago';
import printDate from './ReturnDifferenceBetweenTwoDates.js';

const formatter = buildFormatter(spanishStrings);

class Notifications extends Component {  
    
  //--------------------------------------------------------------/
  //
  // Declaring inital state
  //
  //--------------------------------------------------------------/
  state = {
     keys: [],
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
      
      // Getting the notifications 
      firebase.database().ref('notifications/' + this.props.user.uid).on('value', snapshot => { 
          
          // Capturing data
          var notifications = snapshot.val();
          var keys = notifications ? Object.keys(notifications) : [];
          var array = [];
                    
          // Array of points and setting the state
          if(notifications){ 
              notifications = keys.map( id => {
                  return [notifications[id].points, notifications[id].message, notifications[id].read, notifications[id].timeStamp] 
              });
              this.setState({ keys, notifications });
          }

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
  showNotifications = () => {
      
      this.setState({ show: true });
      
      // Putting all the notifications as read
      if(this.state.notifications)
          this.state.keys.map( key => {
              firebase.database().ref('notifications/' + this.props.user.uid + `/${key}/read/`).transaction( read => read = true )
          });
      
  }
      
  //--------------------------------------------------------------/
  //
  // Represent notifications
  //
  //--------------------------------------------------------------/
  printNotifications = () => {
      
      var points;
      var res;
      var message;
      
      // Drawing block when there are notifications
      res = this.state.notifications.reverse().map( notification =>
                <React.Fragment>
                        { printDate(Date.now(), notification[3]) !== message 
                        && <div  className = 'Notifications-Ago'> {message = printDate(Date.now(), notification[3])} </div>
                        }
                    <div className = 'Notifications-Content'>
                        <span className = 'Notifications-Photo'>
                            <img src = {this.props.user.photoURL}></img>
                        </span>
                        <span className = 'Notifications-Points'>
                            { notification[0] > 0 
                            ? <span className = 'Pos'>+{notification[0]}</span>
                            : <span className = 'Neg'> {notification[0]}</span>
                            }
                        </span>
                        <span className = 'Notifications-Message'>
                            { notification[1] }
                            <TimeAgo formatter = {formatter} date = {notification[3]}/>
                        </span>
                    </div>
                </React.Fragment>
      );
      
      // If 0 notifications, we write it
      if(this.state.notifications.length === 0){
          
          res = <div className = 'Notifications-Content-Empty'>
                    <div className = 'Big-Emoji'>😼</div>
                    <div className = 'Empty-Message'>¡Miaaaaau! Aún no tienes notificaciones.</div>
                </div>
      }
            
      return res;
      
  }
  
  //--------------------------------------------------------------/
  //
  // Get the number of unread notifications
  //
  //--------------------------------------------------------------/
  unreadNotifications = () => {
      
      var notifications = this.state.notifications;
      var length = this.state.notifications.length; 
      var count  = 0;
          
      // Iterates through array of notifications, if read = true, increment count
      for(var i = 0; i < length; i ++) notifications[i][2] === true && count ++;
      
      // Returns the difference between read and unread
      return (length - count);
      
  }
    
  render() {
    return (
        <React.Fragment>
            <div className = 'Notifications'>
                <div className = 'Notifications-Icon' onClick = {this.showNotifications}>
                    <div className = 'Notifications-Logo' onClick = {this.showNotifications}>🔔</div>
                    {  this.state.notifications.length > 0 
                    && this.unreadNotifications() > 0
                    && <span className = 'Notifications-Number'>{this.unreadNotifications()}</span>
                    }
                </div>
                {this.state.show && <div className = 'Notifications-Menu'>{this.printNotifications()}</div>}
            </div>
                {this.state.show && <div onClick = {this.hideNotifications} className = 'Invisible'></div>}
        </React.Fragment>
    );
  }
}

export default Notifications;