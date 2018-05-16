import React, { Component } from 'react';
import firebase from '../Firebase.js';
import Login from '../Login';

class LikesComments extends Component {  
    
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
            
        firebase.database().ref('posts/' + this.props.post + '/replies/'  + this.props.reply).on('value', (snapshot) => { 

            var capture = snapshot.val();            
            
            if(capture) {
                
                if(typeof capture.votes === 'undefined')   this.setState({ capture: capture})
                else                                       this.setState({ capture: capture, votes: capture.votes}) 
                
            }

        });
      
        window.twemoji.parse(document.getElementById('root'));
  } 
  
  componentDidUpdate = () => window.twemoji.parse(document.getElementById('root'));
  
  showBanner = () => this.setState({render: true});     
  hideBanner = () => this.setState({render: false});
   
  handleVote = (e) => { 
      
      var vote = true;
  
      if(typeof this.state.capture.voteUsers === 'undefined'){
          firebase.database().ref('posts/' + this.props.post + '/replies/' + this.props.reply + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          firebase.database().ref('posts/' + this.props.post + '/replies/' + this.props.reply + '/votes/').transaction( value => value - 1 );
      }
      else if(typeof this.state.capture.voteUsers[this.props.user.uid] === 'undefined'){
          firebase.database().ref('posts/' + this.props.post + '/replies/' + this.props.reply + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          firebase.database().ref('posts/' + this.props.post + '/replies/' + this.props.reply + '/votes/').transaction( value => value - 1 );
      }
      else{
          this.state.capture.voteUsers[this.props.user.uid].vote === true ? vote = false : vote = true;
          firebase.database().ref('posts/' + this.props.post + '/replies/' + this.props.reply + '/voteUsers/' + this.props.user.uid).set({ vote: vote });
          if(vote === true ) firebase.database().ref('posts/' + this.props.post + '/replies/' + this.props.reply + '/votes/').transaction( value => value - 1 );
          if(vote === false) firebase.database().ref('posts/' + this.props.post + '/replies/' + this.props.reply + '/votes/').transaction( value => value + 1 );
          
      }
      
      e.preventDefault();
      
  }

  render() {

    return (
      <div className="likes-comments">
            <div className="votes">
                <span onClick={this.props.user ? this.handleVote : this.showBanner}>👏 {this.state.votes * -1 > 0 ? this.state.votes * -1 : null}</span>
            </div>
            {this.state.render ? <Login hide = {this.hideBanner}></Login> : null}
      </div>    
    );
  }
}

export default LikesComments;
