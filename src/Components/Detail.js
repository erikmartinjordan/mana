import React, { useState, useEffect }  from 'react';
import Question                        from './Question';
import Replies                         from './Replies';
import Norms                           from './Norms';
import Comments                        from './Comments';
import NewReply                        from './NewReply';
import firebase, { auth }              from '../Functions/Firebase';
import '../Styles/Forum.css';

const Detail = (props) => {
    
    const [admin, setAdmin] = useState(false);
    const [title, setTitle] = useState(null);
    
    auth.onAuthStateChanged( async user => {

        if(user){
            
            let admin = await fetchAdmin(user);
            
            setAdmin(admin);
        }
        else{
            setAdmin(false);
        }
        
    });
        
    return (
        <div className = 'Forum Detail'>
            <h2>{title}</h2>
            <div className = 'Forum-TwoCol'>
                <div className = 'Main'>
                    <Question postId = {props.match.params.string} admin = {admin} setTitle = {setTitle}/>
                    <Replies  postId = {props.match.params.string} admin = {admin}/>
                    <NewReply postId = {props.match.params.string}/>
                </div>
                <div className = 'Sidebar'>
                    <Norms/>
                    <Comments/>
                </div>
            </div>
      </div>    
    );
}

export default Detail;

export const fetchAdmin = async (user) => {
    
    let idToken = await firebase.auth().currentUser.getIdToken(true);
    
    let url = 'https://us-central1-nomoresheet-pre.cloudfunctions.net/isAdmin';
    
    let response = await fetch(url, {
        "method":  "POST",
        "headers": { "Content-Type": "application/json" },
        "body":    JSON.stringify({ "idToken": idToken })
    });
    
    if(response.ok){
        
        let json    = await response.json();
        
        var isAdmin = json.isAdmin;
        
    } 
    
    return isAdmin;
    
}