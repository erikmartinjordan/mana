import React, { Component } from 'react';
import firebase from '../Firebase.js';
import Login from '../Login';
import nmsNotification from '../InsertNotificationIntoDatabase.js';

class Likes extends Component {  
    
  constructor(){
        super();
        this.state = {
            capture: null,
            forbid: false,
            render: false,
            userid: null,
            votes: 0
        }
      
  }
    
  componentDidMount = () => {
            
        firebase.database().ref('posts/' + this.props.post).on('value', snapshot => { 

            var capture = snapshot.val();            
            
            if(capture) 
                this.setState({ 
                    capture: capture,
                    userid: capture.userUid,
                    votes: capture.votes 
                });

        });
      
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} );
  }
  
  componentDidUpdate = () => { window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} ); }

  showBanner = () => this.setState({render: true}); 
  hideBanner = () => this.setState({render: false});
   
  handleVote = (e) => { 
      
      var vote = true;
  
      if(typeof this.state.capture.voteUsers === 'undefined'){
          firebase.database().ref('posts/' + this.props.post + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          firebase.database().ref('posts/' + this.props.post + '/votes/').transaction( value => value - 1 );
          
          nmsNotification(this.state.userid, 'chili', 'add');
      }
      else if(typeof this.state.capture.voteUsers[this.props.user.uid] === 'undefined'){
          firebase.database().ref('posts/' + this.props.post + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          firebase.database().ref('posts/' + this.props.post + '/votes/').transaction( value => value - 1 );
          
          nmsNotification(this.state.userid, 'chili', 'add');
      }
      else{
          this.state.capture.voteUsers[this.props.user.uid].vote === true ? vote = false : vote = true;
          firebase.database().ref('posts/' + this.props.post + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          if(vote === true ) firebase.database().ref('posts/' + this.props.post + '/votes/').transaction( value => value - 1 );
          if(vote === false) firebase.database().ref('posts/' + this.props.post + '/votes/').transaction( value => value + 1 );
          
          if(vote === true)  nmsNotification(this.state.userid, 'chili', 'add');
          if(vote === false) nmsNotification(this.state.userid, 'chili', 'sub');
          
      }
      
      e.preventDefault();
      
  }

  render() {

    return (
      <div className = 'Likes'>
            <div className="votes">
                <span onClick={this.props.user ? this.handleVote : this.showBanner}>🌶️ {this.state.votes * -1}</span>
            </div>
            {this.state.render ? <Login hide = {this.hideBanner}></Login> : null}
      </div>    
    );
  }
}

export default Likes;
