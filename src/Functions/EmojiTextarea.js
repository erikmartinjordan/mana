import React, { Component } from 'react';
import Emojis from './Emojis';

class EmojiTextarea extends Component {
    
  state = {
          comment: '',
          emojis: '',
          showEmojis: true
  }
    
  componentWillReceiveProps = () => {
      
      this.props.send && this.setState({ comment: '' });
            
  }
  
  handleText = (e) => {
     
      let text = e.target.value;
                  
      // Resizing textarea after key press 
      e.target.style.height = 'inherit';
      e.target.style.height = `${e.target.scrollHeight}px`; 
            
      if(text.charAt(text.length - 1) === ' '){
          
          // Split words to array
          let arr = text.split(' ');
          
          // Get the last word
          let last__word = arr[arr.length - 2].toLowerCase();     
          
          // Filter by last word
          let emojis__texting = Emojis.filter( emoji => ( emoji.tags_ES.indexOf(last__word) !== -1 ));
          
          // Get all emojis
          let emojis = emojis__texting.map( (value, key) => <span key = {key} id = {value.symbol} onClick = {this.handleEmoji}>{value.symbol}</span> ); 
                                           
          // Filter first 10 emojis
          let split__emojis = emojis.slice(0, 10); 
          
          this.setState({ 
            emojis: split__emojis
          }); 
          
      }
      
      this.setState({
          comment: text
      });
      
      this.props.handleChange(text);        
  }
  handleEmoji = (e) => {
            
      let text = this.state.comment + e.currentTarget.id;      
      this.setState({ comment: text });
      this.props.handleChange(text);
  }
    
  render() {                      
       
    return (
      <div className='Emoji-Textarea'>
        <textarea onChange = {this.handleText} value = {this.state.comment} placeholder = 'Escribe tu mensaje...' maxLength = {this.props.maxLength}></textarea>
        <div className = 'Emoji'>
            <div className = 'Emoji-Grid'> 
                { this.state.showEmojis  && this.state.emojis }
            </div>
        </div>
      </div>
    );
  }
}

export default EmojiTextarea;