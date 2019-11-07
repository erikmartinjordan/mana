import React, { useState, useEffect }   from 'react';
import firebase                         from './Firebase.js';
import nmsNotification                  from './InsertNotificationIntoDatabase.js';
import Login                            from '../Components/Login';

const Likes = (props) => {  
    
    const [capture, setCapture] = useState(null);
    const [forbid, setForbid]   = useState(false);
    const [render, setRender]   = useState(false);
    const [userid, setUserid]   = useState(null);
    const [votes, setVotes]     = useState(0);
        
    useEffect( () => {
    
        // Component is mounted
        let mounted = true;
        
        firebase.database().ref('posts/' + props.post).on('value', snapshot => { 

            var capture = snapshot.val();            
            
            if(capture && mounted) {
                
                setCapture(capture);
                setUserid(capture.userUid);
                setVotes(capture.votes);
            }
            
        });
        
        // Unmounting component
        return () => {mounted = false};
        
    },[]);
    
    useEffect( () => {
        
        window.twemoji.parse(document.getElementById('root'), {folder: 'svg', ext: '.svg'} ) 
    
    });
   
    const handleVote = (e) => { 

      var vote = true;

      if(typeof capture.voteUsers === 'undefined'){
          
          firebase.database().ref('posts/' + props.post + '/voteUsers/' + props.user.uid).set({ vote: vote });
          firebase.database().ref('posts/' + props.post + '/votes/').transaction( value => value - 1 );

          nmsNotification(userid, 'chili', 'add');
      }
      else if(typeof capture.voteUsers[props.user.uid] === 'undefined'){
          
          firebase.database().ref('posts/' + props.post + '/voteUsers/' + props.user.uid).set({ vote: vote });
          firebase.database().ref('posts/' + props.post + '/votes/').transaction( value => value - 1 );

          nmsNotification(userid, 'chili', 'add');
      }
      else{
          capture.voteUsers[props.user.uid].vote === true ? vote = false : vote = true;
          firebase.database().ref('posts/' + props.post + '/voteUsers/' + props.user.uid).set({ vote: vote });
          if(vote === true ) firebase.database().ref('posts/' + props.post + '/votes/').transaction( value => value - 1 );
          if(vote === false) firebase.database().ref('posts/' + props.post + '/votes/').transaction( value => value + 1 );

          if(vote === true)  nmsNotification(userid, 'chili', 'add');
          if(vote === false) nmsNotification(userid, 'chili', 'sub');

      }

      e.preventDefault();

    }

    return (
      <div className = 'Likes'>
            <div className = 'votes'>
                <span onClick = {props.user ? (e) => handleVote(e) : () => setRender(true)}>🌶️ {votes * -1}</span>
            </div>
            {render && <Login hide = {() => setRender(false)}></Login>}
      </div>    
    );
}

export default Likes;
