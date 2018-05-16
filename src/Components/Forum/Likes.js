import React, { Component } from 'react';
import firebase from '../Firebase.js';
import Login from '../Login';

class Likes extends Component {  
    
  constructor(){
        super();
        this.state = {
            capture: null,
            forbid: false,
            render: false,
            votes: 0
        }
      
  }
    
  componentDidMount = () => {
            
        firebase.database().ref('posts/' + this.props.post).on('value', (snapshot) => { 

            var capture = snapshot.val();            
            
            if(capture) 
                this.setState({ 
                    capture: capture,
                    votes: capture.votes 
                });

        });
  }
  
  showBanner = () => this.setState({render: true}); 
  hideBanner = () => this.setState({render: false});
   
  handleVote = (e) => { 
      
      var vote = true;
  
      if(typeof this.state.capture.voteUsers === 'undefined'){
          firebase.database().ref('posts/' + this.props.post + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          firebase.database().ref('posts/' + this.props.post + '/votes/').transaction( value => value - 1 );
      }
      else if(typeof this.state.capture.voteUsers[this.props.user.uid] === 'undefined'){
          firebase.database().ref('posts/' + this.props.post + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          firebase.database().ref('posts/' + this.props.post + '/votes/').transaction( value => value - 1 );
      }
      else{
          this.state.capture.voteUsers[this.props.user.uid].vote === true ? vote = false : vote = true;
          firebase.database().ref('posts/' + this.props.post + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          if(vote === true ) firebase.database().ref('posts/' + this.props.post + '/votes/').transaction( value => value - 1 );
          if(vote === false) firebase.database().ref('posts/' + this.props.post + '/votes/').transaction( value => value + 1 );
          
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
